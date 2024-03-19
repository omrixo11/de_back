import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/user.schema';
import { Plan, PlanDocument } from 'src/schemas/plan.schema';
import { BillingCycle } from 'src/schemas/user.schema';
import axios, { AxiosRequestConfig } from 'axios';
import { Article } from 'src/schemas/article.schema';
import { Types } from 'mongoose';
import { PaymentService } from 'src/payment/payment.service';
import { Payment } from 'src/schemas/payment.schema';
import { CreatePaymentDto } from 'src/payment/dto/create-payment.dto';
import { Boost } from 'src/schemas/boost.schema';
import { CreateBoostDto } from 'src/boost/dto/create-boost.dto';
import * as cron from 'node-cron';


@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(Boost.name) private boostModel: Model<Boost>,

    private paymentService: PaymentService,

  ) {
    this.scheduleSubscriptionChecks();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    // Save the user without the associated subscription
    const savedUser = await createdUser.save();

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find()
      .populate('plan')
      .exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id)
      .populate('plan')
      .exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndRemove(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email })
      .populate('plan')
      .exec();
  }

  async findByResetToken(resetToken: string): Promise<User | null> {
    return this.userModel.findOne({ resetPasswordToken: resetToken }).exec();
  }



  async toggleFavorite(userId: string, articleId: string): Promise<User> {
    const userObjectId = new Types.ObjectId(userId); // Ensure ObjectId format
    const articleObjectId = new Types.ObjectId(articleId); // Ensure ObjectId format

    // First, check if the article exists
    const article = await this.articleModel.findById(articleObjectId).exec();
    if (!article) {
      throw new NotFoundException(`Article with id ${articleId} not found`);
    }

    // Check if the article is already favorited by the user
    const user = await this.userModel.findById(userObjectId).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const isFavorited = user.favoriteArticles.some(id => id.equals(articleObjectId));

    if (isFavorited) {
      // If already favorited, remove the article from the user's favorites
      await this.userModel.findByIdAndUpdate(userObjectId, { $pull: { favoriteArticles: articleObjectId } }).exec();
      await this.articleModel.findByIdAndUpdate(articleObjectId, { $pull: { favoritedBy: userObjectId } }).exec();
    } else {
      // If not favorited, add the article to the user's favorites
      await this.userModel.findByIdAndUpdate(userObjectId, { $addToSet: { favoriteArticles: articleObjectId } }).exec();
      await this.articleModel.findByIdAndUpdate(articleObjectId, { $addToSet: { favoritedBy: userObjectId } }).exec();
    }

    // Fetch and return the updated user document
    const updatedUser = await this.userModel.findById(userObjectId).populate('plan').exec();
    return updatedUser;
  }

  async getFavoriteArticles(userId: string): Promise<Article[]> {
    const userObjectId = new Types.ObjectId(userId);

    // First, fetch the user to ensure they exist
    const user = await this.userModel.findById(userObjectId).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Check if the user has any favorite articles
    if (user.favoriteArticles.length === 0) {
      return []; // Return an empty array if there are no favorite articles
    }

    // Fetch and return the favorite articles with populated image URLs
    const favoriteArticles = await this.articleModel.find({
      '_id': { $in: user.favoriteArticles }
    })
      .populate('user')
      .populate('ville')
      .populate('quartier')
      .populate('boost')
      .exec();

    // Mimic the logic to include images as seen in ArticleService
    const articlesWithImages = favoriteArticles.map((article) => {
      const images = article.images.map((filename) => {
        return `http://localhost:5001/media/articles-images/${filename}`;
        // return `https://dessa.ovh/media/articles-images/${filename}`
      });

      return {
        ...article.toJSON(),
        images,
      };
    });

    return articlesWithImages;
  }

  async initiatePurchasePlan(userId: string, planId: string, isYearlyBilling: boolean): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const plan = await this.planModel.findById(planId);
    if (!plan) {
      throw new NotFoundException(`Plan with id ${planId} not found`);
    }

    // Call the external payment gateway here to initiate payment
    // For demonstration, we'll assume this generates a transaction ID
    const transactionId = "unique_transaction_id_from_gateway";

    // Set the subscription start date to the current date
    const subscriptionStartDate = new Date();
    let subscriptionEndDate = new Date(subscriptionStartDate);

    // Calculate the subscription end date based on the billing cycle
    if (isYearlyBilling) {
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
    } else {
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    }

    const VAT_RATE = 0.19; // 19% VAT

    // Calculate the total amount including VAT
    const baseAmount = isYearlyBilling ? plan.yearPrice : plan.monthPrice;
    const totalAmountWithVAT = baseAmount + (baseAmount * VAT_RATE);

    // Round the total amount to 2 decimal places and convert it back to a number
    const roundedAmountWithVAT = parseFloat(totalAmountWithVAT.toFixed(2));

    const paymentDetails: CreatePaymentDto = {
      userId: userId,
      planId: planId,
      amount: roundedAmountWithVAT,
      status: 'pending',
      transactionId: transactionId,
      paymentMethod: 'credit_card',
      isYearlyBilling: isYearlyBilling,

    };

    await this.paymentService.create(paymentDetails);

    // No need to update the user document here since the plan is not applied until payment is confirmed
  }

  async initiateBoostPurchase(createBoostDto: CreateBoostDto): Promise<void> {
    const { userId, articleId, type, duration, price } = createBoostDto;

    // Validate user and article existence
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException(`User with ID ${userId} not found.`);

    const article = await this.articleModel.findById(articleId);
    if (!article) throw new NotFoundException(`Article with ID ${articleId} not found.`);

    // Create the boost record with a pending status
    const newBoost = new this.boostModel({
      articleId: articleId,
      userId: userId,
      type,
      duration,
      price,
      status: 'pending',
    });

    await newBoost.save();

    // Create the payment record. This does not automatically confirm the payment.
    const paymentDetails: CreatePaymentDto = {
      userId,
      articleId,
      boostId: newBoost._id, // Link the Boost ID with the payment record
      amount: price,
      status: 'pending', // Initial payment status
      transactionId: 'unique_transaction_id_from_gateway',
      paymentMethod: 'credit_card', // Assuming this is specified by the user
    };

    await this.paymentService.create(paymentDetails);

    // Note: If your application expects a response, consider using a different approach to handle method outputs
  }

  private scheduleSubscriptionChecks() {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
      await this.checkAndResetExpiredSubscriptions();
    });
  }

  private async checkAndResetExpiredSubscriptions() {
    const today = new Date();
    const expiredSubscriptions = await this.userModel.find({
      subscriptionEndDate: { $lte: today },
      planStatus: 'active',
    });

    for (const user of expiredSubscriptions) {
      user.isOnPlan = false;
      user.plan = null;
      user.subscriptionStartDate = null;
      user.subscriptionEndDate = null;
      user.planStatus = 'expired';
      user.maxPosts = 3;

      await user.save();
      console.log(`Reset subscription for user ${user.email}`);
    }
  }
}
