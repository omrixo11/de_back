import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/user.schema';
import { Plan, PlanDocument } from 'src/schemas/plan.schema';
import { BillingCycle } from 'src/schemas/user.schema';
import { PaymentService } from 'src/payment/payment.service';
import axios, { AxiosRequestConfig } from 'axios';
import { Article } from 'src/schemas/article.schema';
import { Types } from 'mongoose';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    @InjectModel(Article.name) private articleModel: Model<Article>, 
    private paymentService: PaymentService,

  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    // Save the user without the associated subscription
    const savedUser = await createdUser.save();

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('plan').exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).populate('plan').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndRemove(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).populate('plan').exec();
  }

  async findByResetToken(resetToken: string): Promise<User | null> {
    return this.userModel.findOne({ resetPasswordToken: resetToken }).exec();
  }

  async purchasePlan(userId: string, planId: string, isYearlyBilling: boolean): Promise<User> {
    const user = await this.userModel.findById(userId).populate('plan').exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const plan = await this.planModel.findById(planId).exec();
    if (!plan) {
      throw new NotFoundException(`Plan with id ${planId} not found`);
    }

    // Set the user's plan
    user.plan = plan;
    user.billingCycle = isYearlyBilling ? BillingCycle.Yearly : BillingCycle.Monthly;
    user.isOnPlan = true;

    // Save the updated user
    await user.save();

    return user;
  }

  async toggleFavorite(userId: string, articleId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  
    const article = await this.articleModel.findById(articleId).exec();
    if (!article) {
      throw new NotFoundException(`Article with id ${articleId} not found`);
    }
  
    const articleObjectId = Types.ObjectId.createFromHexString(articleId); // Convert to ObjectId
    const userObjectId = Types.ObjectId.createFromHexString(userId); // Convert to ObjectId

    const isFavorited = user.favoriteArticles.includes(articleObjectId);
  
    if (isFavorited) {
      // Remove article from favorites
      user.favoriteArticles = user.favoriteArticles.filter(id => id.toString() !== articleObjectId.toString());
      article.favoritedBy = article.favoritedBy.filter(id => id.toString() !== userId);
    } else {
      // Add article to favorites
      user.favoriteArticles.push(articleObjectId);
      article.favoritedBy.push(userObjectId);
    }
  
    await user.save();
    await article.save();
  
    return user;
  }

}
