import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private isDevelopment: boolean = true;

  constructor(private readonly configService: ConfigService) {
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPassword = this.configService.get<string>('SMTP_PASSWORD');

    // Only create transporter if SMTP credentials are provided
    if (smtpUser && smtpPassword) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
        port: this.configService.get<number>('SMTP_PORT') || 587,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });
      this.isDevelopment = false;
    } else {
      this.logger.warn('SMTP credentials not configured. Running in development mode with email logging.');
    }
  }

  async sendOtpEmail(email: string, otp: string, name: string): Promise<void> {
    const subject = 'Verify Your Email Address';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Welcome to Boutique!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with Boutique. Please use the following verification code to verify your email address:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification code, please ignore this email.</p>
        <p>Best regards,<br>The Boutique Team</p>
      </div>
    `;

    if (this.isDevelopment) {
      this.logger.log(`[DEV MODE] OTP for ${email}: ${otp}`);
      return;
    }

    await this.sendEmail(email, subject, html);
  }

  async sendPasswordResetEmail(email: string, resetToken: string, name: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    const subject = 'Reset Your Password';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The Boutique Team</p>
      </div>
    `;

    if (this.isDevelopment) {
      this.logger.log(`[DEV MODE] Password reset link for ${email}: ${resetUrl}`);
      return;
    }

    await this.sendEmail(email, subject, html);
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM') || 'noreply@boutique.com',
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw new Error('Failed to send email');
    }
  }
}
