import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, BadRequestException, Param, Patch, NotFoundException } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { JwtAuthGuard } from './user-auth.middleware';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';

@Controller('user-auth')

export class UserAuthController {
  constructor(private userAuthService: UserAuthService) { }

  @Patch('change-password/:userId')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Param('userId') userId: string,
    @Body() body: { oldPassword: string; newPassword: string }
  ) {
    const { oldPassword, newPassword } = body;

    try {
      await this.userAuthService.changePassword(userId, oldPassword, newPassword);
      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      if (error.status === HttpStatus.FORBIDDEN) {
        throw new BadRequestException(error.response);
      } else {
        throw new NotFoundException(error.response);
      }
    }
  }

  @Patch('update-user/:userId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateUser(
    @Param('userId') userId: string,
    @Body() body: { updateData: UpdateUserDto; currentPassword: string },
    @UploadedFile() profileImage?: Express.Multer.File,
  ) {
    const { updateData, currentPassword } = body;

    try {
      const updatedUser = await this.userAuthService.updateUser(userId, updateData, currentPassword, profileImage);
      return {
        message: 'User updated successfully',
        updatedUser,
      };
    } catch (error) {
      if (error.status === HttpStatus.FORBIDDEN) {
        throw new BadRequestException(error.response);
      } else {
        throw new NotFoundException(error.response);
      }
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    const user = await this.userAuthService.validateUser(email, password);
    if (user) {
      return {
        message: 'Authentication successful',
        user,
      };
    } else {
      return {
        message: 'Authentication failed',

      };
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userAuthService.register(createUserDto);
    if (user) {
      return {
        message: 'Registration successful',
        user,
      };
    } else {
      return {
        message: 'Email is already in use',
      };
    }
  }

  @Post('resend-email-verification')
  @HttpCode(HttpStatus.OK)
  async resendEmailVerification(@Body() body: { userId: string }) {
    const { userId } = body;

    try {
      const user = await this.userAuthService.resendEmailVerification(userId);
      return {
        message: 'Email verification code resent successfully',
        user,
      };
    } catch (error) {
      return {
        message: 'Error resending email verification code',
        error: error.message,
      };
    }
  }

  @Post('verify-email-code/:userId')
  @HttpCode(HttpStatus.OK)
  async verifyEmailCode(
    @Param('userId') userId: string,
    @Body() body: { confirmationCode: string }
  ) {
    const { confirmationCode } = body;

    try {
      const user = await this.userAuthService.verifyEmailCode(userId, confirmationCode);
      return {
        message: 'Email verification successful',
        user,
      };
    } catch (error) {
      return {
        message: 'Email verification failed',
      };
    }
  }


  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    const { email } = body;

    try {
      // Check if the user with the provided email exists
      const user = await this.userAuthService.findUserByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Generate a reset token and send an email to the user
      const resetToken = this.userAuthService.generateResetToken();

      // Save the reset token in the user document
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 1800000); // Set expiration time
      await user.save();

      // Send the reset password email with the user's email and generated reset token
      await this.userAuthService.sendPasswordResetEmail(user.email, resetToken);

      return {
        message: 'Password reset email sent successfully',
      };
    } catch (error) {
      return {
        message: 'Error sending password reset email',
        error: error.message,
      };
    }
  }

  @Patch('reset-password/:resetToken')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('resetToken') resetToken: string,
    @Body() body: { newPassword: string }
  ) {
    const { newPassword } = body;

    try {
      const user = await this.userAuthService.resetPassword(resetToken, newPassword);
      return {
        message: 'Password reset successful',
        user,
      };
    } catch (error) {
      return {
        message: 'Password reset failed',
        error: error.message,
      };
    }
  }

  @Post('check-email-existence')
  @HttpCode(HttpStatus.OK)
  async checkEmailExistence(@Body() body: { email: string }) {
    const { email } = body;

    try {
      const user = await this.userAuthService.findUserByEmail(email);

      return {
        exists: !!user,
      };
    } catch (error) {
      return {
        exists: false,
        error: error.message,
      };
    }
  }

}
