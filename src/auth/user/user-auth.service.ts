import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { NodeMailerService } from 'src/utils/node.mailer';
import { User } from 'src/schemas/user.schema';
import { sendSms } from 'src/utils/twillio.sms';
import { randomBytes } from 'crypto';
import { confirmationEmailTemplate, passwordResetEmailTemplate } from 'src/utils/email.templates';


@Injectable()
export class UserAuthService {

  constructor(
    private userService: UserService,
    private nodeMailerService: NodeMailerService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();

      const token = this.generateToken(result);

      return { token, ...result };
    }
    return null;
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    
    const existingUser = await this.userService.findByEmail(createUserDto.email);
    if (existingUser) {
      return null;
    }

    const confirmationCode = this.generateConfirmationCode();
    const newUser = await this.userService.create({ ...createUserDto, confirmationCode });
    const { password, ...result } = newUser.toObject();

    // Send confirmation email
    await this.sendConfirmationEmail(newUser.email, confirmationCode);

    const token = this.generateToken(result);

    return { token, ...result };
  }

  private generateConfirmationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

  async verifyEmailCode(userId: string, confirmationCode: string): Promise<User> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.confirmationCode === confirmationCode) {
      // Code is correct, update isEmailVerified property
      user.isEmailVerified = true;
      // Optionally, you can reset the confirmation code
      user.confirmationCode = null;
      await user.save();
      return user;
    } else {
      throw new NotFoundException('Invalid confirmation code');
    }
  }

  private async sendConfirmationEmail(email: string, confirmationCode: string): Promise<void> {
    console.log("email:", email);

    const subject = 'Confirm your email';
    const html = confirmationEmailTemplate(confirmationCode);
    // You can use your nodemailer logic here
    await this.nodeMailerService.sendEmail(email, subject, html);
  }

  async resendEmailVerification(userId: string): Promise<User> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a new confirmation code
    const confirmationCode = this.generateConfirmationCode();
    user.confirmationCode = confirmationCode;
    await user.save();

    // Send the new confirmation email
    await this.sendConfirmationEmail(user.email, confirmationCode);

    return user;
  }

  private generateToken(payload: any): string {
    const secret = '1234567890qwertyuiop';
    const expiresIn = '2h';
    return jwt.sign(payload, secret, { expiresIn });
  }

  async sendVerificationCodeSms(phoneNumber: string, verificationCode: string): Promise<void> {
    const smsBody = `Your verification code is: ${verificationCode}`;

    try {
      await sendSms({ to: phoneNumber, body: smsBody });
    } catch (error) {
      // Handle error sending SMS
      console.error('Error sending verification code via SMS:', error);
      throw new Error('Error sending verification code');
    }
  }

  // Reset password logic
  generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }

  async findUserByEmail(email: string) {
    return this.userService.findByEmail(email);
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const subject = 'Password Reset';
    const html = passwordResetEmailTemplate(resetToken);

    try {
      await this.nodeMailerService.sendEmail(email, subject, html);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Error sending password reset email');
    }
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<User> {
    const user = await this.userService.findByResetToken(resetToken);

    if (!user) {
      throw new NotFoundException('Invalid or expired reset token');
    }

    // Check if the reset token has expired
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new NotFoundException('Reset token has expired');
    }

    // Update user password and reset token
    user.password = newPassword; // Assuming newPassword is already plain text
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // Save the updated user
    await user.save();

    return user;
  }


}
