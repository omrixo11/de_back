import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from 'src/schemas/payment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Plan } from 'src/schemas/plan.schema';
import { Boost } from 'src/schemas/boost.schema';
import { Article } from 'src/schemas/article.schema';

@Injectable()
export class PaymentService {

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Plan.name) private planModel: Model<Plan>,
    @InjectModel(Boost.name) private boostModel: Model<Boost>,
    @InjectModel(Article.name) private articleModel: Model<Article>,

  ) { }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {

    const payment = new this.paymentModel(createPaymentDto);
    return payment.save();
  }

  async confirmPaymentSuccess(transactionId: string): Promise<User> {
    const payment = await this.paymentModel.findOne({ transactionId });

    if (!payment) {
      throw new NotFoundException(`Payment with transaction ID ${transactionId} not found`);
    }

    if (payment.status !== 'pending') {
      throw new Error('Payment is not in pending state');
    }

    payment.status = 'success';
    await payment.save();

    const user = await this.userModel.findById(payment.userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${payment.userId} not found`);
    }

    const plan = await this.planModel.findById(payment.planId);
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${payment.planId} not found`);
    }
    user.plan = plan;

    user.isOnPlan = true;

    await user.save();

    return user;
  }

  async confirmPaymentSuccessById(paymentId: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(paymentId).exec();

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }

    if (payment.status === 'success') {
      throw new BadRequestException('This payment has already been confirmed');
    }

    // Update the payment status to 'success'
    payment.status = 'success'
    await payment.save();

    // Retrieve the user associated with the payment
    const user = await this.userModel.findById(payment.userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${payment.userId} not found`);
    }

    // Retrieve the plan associated with the payment
    const plan = await this.planModel.findById(payment.planId).exec();
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${payment.planId} not found`);
    }

    let startDate = user.subscriptionStartDate ? new Date(user.subscriptionStartDate) : new Date();
    if (isNaN(startDate.getTime())) {
        startDate = new Date(); 
    }

    let endDate = new Date(startDate);
    if (payment.isYearlyBilling) {
        endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
        endDate.setMonth(endDate.getMonth() + 1);
    }

    user.subscriptionStartDate = new Date();
    user.subscriptionEndDate = endDate;
    user.plan = plan;
    user.isOnPlan = true;
    user.planStatus = 'active'
    user.maxPosts = plan.maxPosts;
    await user.save();
    return payment;
  }

  async confirmBoostPaymentSuccess(paymentId: string): Promise<Boost> {
    // Find the payment with the provided payment ID
    const payment = await this.paymentModel.findById(paymentId);

    // Validate payment existence and state
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }
    if (payment.status !== 'pending') {
      throw new BadRequestException(`Payment with ID ${paymentId} is not in a pending state`);
    }

    // Update the payment status to 'success'
    payment.status = 'success';
    await payment.save();

    // Retrieve the boost associated with the payment
    const boost = await this.boostModel.findById(payment.boostId);
    if (!boost) {
      throw new NotFoundException(`Boost with ID linked to payment ID ${paymentId} not found`);
    }

    // Optionally, validate boost state before activation
    if (boost.status === 'active') {
      throw new BadRequestException(`Boost linked to payment ID ${paymentId} is already active`);
    }

    // Retrieve the article associated with the boost
    const article = await this.articleModel.findById(boost.articleId);
    if (!article) {
      throw new NotFoundException(`Article with ID linked to boost ID ${boost._id} not found`);
    }

    // Update boost and article status and association
    boost.paymentStatus = 'paid';
    boost.status = 'active';
    article.boost = boost._id;

    await Promise.all([boost.save(), article.save()]);

    return boost;
  }


}
