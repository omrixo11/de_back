import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { NodeMailerService } from 'src/utils/node.mailer';
import { User } from 'src/schemas/user.schema';
import { sendSms } from 'src/utils/twillio.sms';
import { randomBytes } from 'crypto';
import { confirmationEmailTemplate, passwordResetEmailTemplate } from 'src/utils/email.templates';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class UserAuthService {

  constructor(
    private userService: UserService,
    private nodeMailerService: NodeMailerService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      let userObject = user.toObject();

      const { password, ...result } = userObject;

      const profileImageUrl = userObject.profileImg
        ? `http://localhost:5001/media/user-profile-images/${userObject.profileImg}`
        // ? `https://dessa.ovh/media/user-profile-images/${userObject.profileImg}`
        : null;

      console.log("profileImageUrl:", profileImageUrl)

      const token = this.generateToken(result);

  
      await user.populate('plan');
      const finalResult = {
        ...result,
        profileImg: profileImageUrl, 
        token, 
      };
      const jsonResponse = JSON.stringify(finalResult);
      return finalResult;
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

    // Populate the user's plan after creating the user
    await newUser.populate('plan');


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

    const subject = 'Confirmation email';
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

  // Reset password logic
  generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }

  async findUserByEmail(email: string) {
    return this.userService.findByEmail(email);
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const subject = 'Réinitialisation de mot de passe';
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
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // Save the updated user
    await user.save();

    return user;
  }

  async updateUser(userId: string, updateData: any, currentPassword: string, imageFile?: Express.Multer.File): Promise<User> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Incorrect password. Please try again.', HttpStatus.FORBIDDEN);
    }

    // If an image file is provided, handle the profile image update
    if (imageFile) {
      if (user.profileImg) {
        // Delete the existing profile image if it exists
        await this.deleteProfileImage(user.profileImg);
      }

      // Save the new profile image and update the user's profile image reference
      const profileImageName = await this.saveProfileImage(imageFile);
      user.profileImg = profileImageName;
    }

    // Check if the email has been changed and if it exists for another user
    if (updateData.email && updateData.email !== user.email) {
      const existingUserWithEmail = await this.userService.findByEmail(updateData.email);
      if (existingUserWithEmail) {
        throw new HttpException('Email already exists. Please choose a different email.', HttpStatus.BAD_REQUEST);
      }
      // If the email has changed, set isEmailVerified to false
      user.isEmailVerified = false;
    }

    // Check if the email has been changed
    if (updateData.email && updateData.email !== user.email) {
      // If the email has changed, set isEmailVerified to false
      user.isEmailVerified = false;
    }

    // Construct the full URL for the profile image
    const profileImageUrl = user.profileImg
      ? `http://localhost:5001/media/user-profile-images/${user.profileImg}`
      // ? `https://dessa.ovh/media/user-profile-images/${user.profileImg}`
      : null;

    // Update other user information
    Object.keys(updateData).forEach(key => {
      if (key !== 'password') { // Ensure the password isn't inadvertently updated
        user[key] = updateData[key];
      }
    });

    await user.save();

    // Exclude the password and other sensitive information before returning
    const { password, ...result } = user.toObject();
    const finalResult = {
      ...result,
      profileImg: profileImageUrl, // Include the full URL for the profile image
    };

    return finalResult;
  }

  private async deleteProfileImage(imageFileName: string): Promise<void> {
    const mediaFolderPath = path.resolve(__dirname, '..', '..', '..', 'media', 'user-profile-images');
    const imagePath = path.join(mediaFolderPath, imageFileName)

    try {
      await fsPromises.unlink(imagePath);
    } catch (error) {
      // If the file doesn't exist, log the error and move on
      if (error.code !== 'ENOENT') {
        console.error('Error deleting profile image:', error);
        // Optionally, rethrow the error or handle it as per your application's requirements
      }
    }
  }

  private async saveProfileImage(imageFile: Express.Multer.File): Promise<string> {
    const mediaFolderPath = path.resolve(__dirname, '..', '..', '..', 'media', 'user-profile-images');
    await fsPromises.mkdir(mediaFolderPath, { recursive: true });
    if (!imageFile.buffer || !imageFile.originalname) {
      throw new Error('Invalid image file');
    }
    // Create the media folder if it doesn't exist
    await fsPromises.mkdir(mediaFolderPath, { recursive: true });

    const imageFileName = `${Date.now()}_${imageFile.originalname}`;
    const imagePath = path.join(mediaFolderPath, imageFileName);
    await fsPromises.writeFile(imagePath, imageFile.buffer);

    console.log('Media Folder Path:', mediaFolderPath);

    return imageFileName;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Incorrect old password. Please try again.', HttpStatus.FORBIDDEN);
    }

    // Update the user's password in the database
    user.password = newPassword;
    await user.save();
  }
}
