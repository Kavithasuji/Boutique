import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { AccountStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class CustomerAuthService {
  private readonly logger = new Logger(CustomerAuthService.name);
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly RESET_TOKEN_EXPIRY_HOURS = 1;
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;
  private readonly ACCESS_TOKEN_EXPIRY_MINUTES = 15;
  private readonly OTP_RESEND_COOLDOWN_SECONDS = 60;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.accountStatus === AccountStatus.PENDING_VERIFICATION) {
        // Allow re-registration if pending verification
        await this.prisma.user.delete({
          where: { id: existingUser.id },
        });
      } else {
        throw new ConflictException('User already exists');
      }
    }

    // Create user with pending verification status
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        role: Role.CUSTOMER,
        accountStatus: AccountStatus.PENDING_VERIFICATION,
        isEmailVerified: false,
      },
    });

    // Generate and send OTP
    await this.generateAndSendOtp(user.id, user.email, user.name);

    return {
      message: 'Registration successful. Please check your email for verification code.',
      email: user.email,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;

    // Find valid OTP token
    const otpToken = await this.prisma.otpToken.findFirst({
      where: {
        email,
        otp,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!otpToken) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark OTP as used
    await this.prisma.otpToken.update({
      where: { id: otpToken.id },
      data: { isUsed: true },
    });

    return {
      message: 'OTP verified successfully. Please set your password.',
      email: otpToken.user.email,
    };
  }

  async setPassword(setPasswordDto: SetPasswordDto) {
    const { email, password, confirmPassword } = setPasswordDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.accountStatus !== AccountStatus.PENDING_VERIFICATION) {
      throw new BadRequestException('Account already active or invalid state');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with password and activate account
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        accountStatus: AccountStatus.ACTIVE,
        isEmailVerified: true,
      },
    });

    // Generate tokens and auto-login
    const tokens = await this.generateTokens(updatedUser);

    return {
      message: 'Password set successfully. You are now logged in.',
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password, rememberMe } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    // Check account status
    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    // Check if password is set
    if (!user.password) {
      throw new UnauthorizedException('Please set your password first');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokenExpiry = rememberMe 
      ? this.REFRESH_TOKEN_EXPIRY_DAYS 
      : 1; 
    const tokens = await this.generateTokens(user, tokenExpiry);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const { email } = resendOtpDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.accountStatus !== AccountStatus.PENDING_VERIFICATION) {
      throw new BadRequestException('Account already verified');
    }

    // Check cooldown
    const recentOtp = await this.prisma.otpToken.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - this.OTP_RESEND_COOLDOWN_SECONDS * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentOtp) {
      throw new BadRequestException(
        `Please wait ${this.OTP_RESEND_COOLDOWN_SECONDS} seconds before requesting another OTP`,
      );
    }

    // Generate and send new OTP
    await this.generateAndSendOtp(user.id, user.email, user.name);

    return {
      message: 'New OTP sent to your email',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return {
        message: 'If an account exists with this email, a password reset link has been sent.',
      };
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException('Please verify your email first');
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + this.RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    // Store reset token
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    // Send reset email
    await this.emailService.sendPasswordResetEmail(user.email, resetToken, user.name);

    return {
      message: 'If an account exists with this email, a password reset link has been sent.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password, confirmPassword } = resetPasswordDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Find valid reset token
    const resetTokenRecord = await this.prisma.passwordResetToken.findFirst({
      where: {
        token,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!resetTokenRecord) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await this.prisma.user.update({
      where: { id: resetTokenRecord.user.id },
      data: { password: hashedPassword },
    });

    // Mark reset token as used
    await this.prisma.passwordResetToken.update({
      where: { id: resetTokenRecord.id },
      data: { isUsed: true },
    });

    // Invalidate all refresh tokens for this user
    await this.prisma.refreshToken.updateMany({
      where: { userId: resetTokenRecord.user.id },
      data: { isRevoked: true },
    });

    return {
      message: 'Password reset successful. Please login with your new password.',
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    // Find refresh token
    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Check user status
    if (tokenRecord.user.accountStatus !== AccountStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(tokenRecord.user);

    // Revoke old refresh token
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { isRevoked: true },
    });

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async logout(userId: string) {
    // Revoke all refresh tokens for this user
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });

    return {
      message: 'Logout successful',
    };
  }

async getProfile(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      accountStatus: true,
      isEmailVerified: true,
      createdAt: true,

      addresses: {
        orderBy: [
          {
            isDefault: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
        select: {
          id: true,
          fullName: true,
          phone: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          state: true,
          country: true,
          postalCode: true,
          isDefault: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new BadRequestException("User not found");
  }

  return user;
}
  private async generateAndSendOtp(userId: string, email: string, name: string) {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    // Store OTP
    await this.prisma.otpToken.create({
      data: {
        userId,
        email,
        otp,
        expiresAt,
      },
    });

    // Send OTP email
    await this.emailService.sendOtpEmail(email, otp, name);
  }

  private async generateTokens(user: any, refreshExpiryDays?: number) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: `${this.ACCESS_TOKEN_EXPIRY_MINUTES}m`,
    });

    const refreshTokenExpiry = refreshExpiryDays || this.REFRESH_TOKEN_EXPIRY_DAYS;
    const refreshToken = randomBytes(32).toString('hex');
    const refreshExpiresAt = new Date(Date.now() + refreshTokenExpiry * 24 * 60 * 60 * 1000);

    // Store refresh token
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
