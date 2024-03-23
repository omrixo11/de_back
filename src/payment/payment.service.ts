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
import { AdsBanner } from 'src/schemas/adsBanner';
import { InvoiceService } from 'src/invoice/invoice.service';
import { CreateInvoiceDto } from 'src/invoice/dto/create-invoice.dto';
import { invoiceEmailTemplate } from 'src/utils/email.templates';
import { GiftCard, GiftCardStatus } from 'src/schemas/giftCard.schema';
import { NodeMailerService } from 'src/utils/node.mailer';

@Injectable()
export class PaymentService {

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Plan.name) private planModel: Model<Plan>,
    @InjectModel(Boost.name) private boostModel: Model<Boost>,
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(AdsBanner.name) private adsBannerModel: Model<AdsBanner>,
    @InjectModel(GiftCard.name) private giftCardModel: Model<GiftCard>,
    private invoiceService: InvoiceService,
    private mailService: NodeMailerService,
  ) { }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {

    const payment = new this.paymentModel(createPaymentDto);
    return payment.save();
  }

  generateInvoiceNumber(): string {
    return `FAC-${Date.now()}`;
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

    // Update the payment status to 'success'
    payment.status = 'success'
    await payment.save();

    //facture
    const createInvoiceDto: CreateInvoiceDto = {
      invoiceNumber: this.generateInvoiceNumber(),
      userFirstName: user.firstName,
      userLastName: user.lastName,
      description: `Abonnement Dessa ${plan.planName}`,
      date: new Date(),
      amount: payment.amount,
    };
    const invoice = await this.invoiceService.create(createInvoiceDto);

    // Generate the invoice email content
    const emailContent = invoiceEmailTemplate({
      userFirstName: user.firstName,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      date: invoice.date.toISOString().split('T')[0],
      description: invoice.description,
    });

    // Send the invoice email
    await this.mailService.sendEmail(user.email, 'Votre facture Dessa', emailContent);

    user.subscriptionStartDate = new Date();
    user.subscriptionEndDate = endDate;
    user.plan = plan;
    user.isOnPlan = true;
    user.planStatus = 'active'
    user.maxPosts = plan.maxPosts;
    user.invoices.push((invoice as any)._id);
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

    const user = await this.userModel.findById(payment.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${payment.userId} not found`);
    }

    // Assuming a method to generate the boost related description
    const description = `Dessa Boost`;

    const createInvoiceDto: CreateInvoiceDto = {
      invoiceNumber: this.generateInvoiceNumber(),
      userFirstName: user.firstName,
      userLastName: user.lastName,
      description: description,
      date: new Date(),
      amount: payment.amount,
    };

    const invoice = await this.invoiceService.create(createInvoiceDto);

    user.invoices.push((invoice as any)._id);
    await user.save();

    const emailContent = invoiceEmailTemplate({
      userFirstName: user.firstName,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      date: invoice.date.toISOString().split('T')[0],
      description: invoice.description,
    });

    await this.mailService.sendEmail(user.email, 'Votre Facture Dessa pour Boost', emailContent);

    // Update boost and article status and association
    boost.paymentStatus = 'paid';
    boost.status = 'active';
    article.boost = boost._id;

    await Promise.all([boost.save(), article.save()]);

    return boost;
  }

  async confirmAdsBannerPaymentSuccess(paymentId: string): Promise<AdsBanner> {
    // Find the payment with the provided payment ID
    const payment = await this.paymentModel.findById(paymentId);

    // Validate payment existence and status
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }
    if (payment.status !== 'pending') {
      throw new BadRequestException(`Payment with ID ${paymentId} is not in a pending state`);
    }

    // Update the payment status to 'success'
    payment.status = 'success';
    await payment.save();

    // Retrieve the ads banner associated with the payment
    const adsBanner = await this.adsBannerModel.findById(payment.adsBannerId);
    if (!adsBanner) {
      throw new NotFoundException(`AdsBanner with ID linked to payment ID ${paymentId} not found`);
    }

    // Optionally, validate ads banner state before marking it as active
    if (adsBanner.status === 'active') {
      throw new BadRequestException(`AdsBanner linked to payment ID ${paymentId} is already active`);
    }

    // Calculate expiration date based on the banner's duration
    const durationInMilliseconds = adsBanner.duration * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    const expirationDate = new Date(Date.now() + durationInMilliseconds);
    adsBanner.expirationDate = expirationDate;
    adsBanner.paymentStatus = 'paid';
    adsBanner.status = 'active';

    console.log("durationInMilliseconds:", durationInMilliseconds)
    console.log("duration:", adsBanner.duration)
    console.log("expirationDate:", expirationDate)


    const user = await this.userModel.findById(payment.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${payment.userId} not found`);
    }

    const description = `Bannière Publicitaire`;

    const createInvoiceDto: CreateInvoiceDto = {
      invoiceNumber: this.generateInvoiceNumber(),
      userFirstName: user.firstName,
      userLastName: user.lastName,
      description: description,
      date: new Date(),
      amount: payment.amount,
    };

    const invoice = await this.invoiceService.create(createInvoiceDto);

    user.invoices.push((invoice as any)._id);
    await user.save();

    const emailContent = invoiceEmailTemplate({
      userFirstName: user.firstName,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      date: invoice.date.toISOString().split('T')[0],
      description: invoice.description,
    });

    await this.mailService.sendEmail(user.email, 'Votre Facture Dessa pour Bannière Publicitaire', emailContent);

    await adsBanner.save();

    return adsBanner;
  }

  async payWithGiftCard(userId: string, giftCardCode: string): Promise<User> {
    // Validate and find the gift card
    const giftCard = await this.giftCardModel.findOne({ code: giftCardCode, status: GiftCardStatus.Unused }).exec();

    if (!giftCard) {
      throw new NotFoundException('Gift card not found.');
    }

    if (giftCard.status === GiftCardStatus.Used) {
      throw new BadRequestException('This gift card has already been used.');
    }

    if (giftCard.status === GiftCardStatus.Expired || giftCard.expirationDate < new Date()) {
      throw new BadRequestException('This gift card is expired.');
    }

    const plan = await this.planModel.findOne({ planName: giftCard.planName }).exec();
    if (!plan) {
      throw new NotFoundException(`Plan associated with the gift card (${giftCard.planName}) not found.`);
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.plan = plan._id;
    user.isOnPlan = true;
    user.maxPosts = plan.maxPosts;
    user.planStatus = 'active';

    user.subscriptionStartDate = new Date();
    let endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    user.subscriptionEndDate = endDate;

    await user.save();

    giftCard.status = GiftCardStatus.Used;
    await giftCard.save();

    await user.populate('plan');
    await user.populate('invoices');

    let userObject = user.toObject();

    const profileImageUrl = userObject.profileImg
      ? `http://localhost:5001/media/user-profile-images/${userObject.profileImg}`
      // ? `https://dessa.ovh/media/user-profile-images/${userObject.profileImg}`
      : null;

    // Update the user object with the profile image URL
    userObject.profileImg = profileImageUrl;

    const { password, __v, ...safeUserObject } = userObject;


    return safeUserObject as any;

  }


}
