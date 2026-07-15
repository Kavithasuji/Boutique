import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { CustomerAuthService } from './customer-auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtCustomerGuard } from './guards/jwt-customer.guard';

@ApiTags('Customer Authentication')
@Controller('customer-auth')
export class CustomerAuthController {
  constructor(
    private readonly customerAuthService: CustomerAuthService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Customer Registration',
    description: 'Register a new customer account and send OTP verification email',
  })
  @ApiResponse({
    status: 200,
    description: 'Registration successful. OTP sent to email.',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.customerAuthService.register(registerDto);
  }

  @Post('verify-otp')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify OTP',
    description: 'Verify the OTP sent to email during registration',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired OTP',
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.customerAuthService.verifyOtp(verifyOtpDto);
  }

  @Post('set-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set Password',
    description: 'Set password after OTP verification and auto-login',
  })
  @ApiResponse({
    status: 200,
    description: 'Password set successfully and user logged in',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or passwords do not match',
  })
  async setPassword(@Body() setPasswordDto: SetPasswordDto) {
    return this.customerAuthService.setPassword(setPasswordDto);
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Customer Login',
    description: 'Login with email and password',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or account not verified',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.customerAuthService.login(loginDto);
  }

  @Post('resend-otp')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend OTP',
    description: 'Resend OTP verification email',
  })
  @ApiResponse({
    status: 200,
    description: 'New OTP sent successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'User not found or account already verified',
  })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.customerAuthService.resendOtp(resendOtpDto);
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 requests per hour
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Forgot Password',
    description: 'Request password reset link via email',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset link sent if account exists',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.customerAuthService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 requests per hour
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset Password',
    description: 'Reset password using the token from email',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.customerAuthService.resetPassword(resetPasswordDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh Token',
    description: 'Refresh access token using refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.customerAuthService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtCustomerGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout',
    description: 'Logout and invalidate refresh tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async logout(@Request() req) {
    return this.customerAuthService.logout(req.user.id);
  }

  @Get('profile')
  @UseGuards(JwtCustomerGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Profile',
    description: 'Get current customer profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getProfile(@Request() req) {
    return this.customerAuthService.getProfile(req.user.id);
  }
}
