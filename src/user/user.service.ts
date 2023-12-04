import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/user.schema';
import { CronJob } from 'cron';
import { Plan, PlanDocument } from 'src/schemas/plan.schema';
import { BillingCycle } from 'src/schemas/user.schema';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,

  ) {}
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    // Save the user without the associated subscription
    const savedUser = await createdUser.save();

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
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
    return this.userModel.findOne({ email }).exec();
  }

  async findByResetToken(resetToken: string): Promise<User | null> {
    return this.userModel.findOne({ resetPasswordToken: resetToken }).exec();
  }

  async purchasePlan(userId: string, planId: string, isYearlyBilling: boolean): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
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


}
