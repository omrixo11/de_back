import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Boost } from 'src/schemas/boost.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateBoostDto } from './dto/create-boost.dto';
import { UpdateBoostDto } from './dto/update-boost.dto';

@Injectable()
export class BoostService {
  constructor(
    @InjectModel(Boost.name) private boostModel: Model<Boost>,
  ) {}

  async findAll(): Promise<Boost[]> {
    return this.boostModel.find().exec();
  }

  async findById(id: string): Promise<Boost | null> {
    return this.boostModel.findById(id).exec();
  }

  async create(createBoostDto: CreateBoostDto): Promise<Boost> {
    const createdBoost = new this.boostModel(createBoostDto);
    return createdBoost.save();
  }

  async update(id: string, updateBoostDto: UpdateBoostDto): Promise<Boost | null> {
    return this.boostModel.findByIdAndUpdate(id, updateBoostDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Boost | null> {
    return this.boostModel.findByIdAndRemove(id).exec();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateBoostStatuses(): Promise<void> {
    // Find all boosts with 'active' status
    const activeBoosts = await this.boostModel.find({ status: 'active' }).exec();

    // Update the status of boosts based on their duration
    const currentDate = new Date();
    for (const boost of activeBoosts) {
      // Get the createdAt date using Mongoose's get method
      const boostCreatedAt = boost.get('createdAt') as Date;
      
      // Calculate the boost end date by adding the duration to the createdAt date
      const boostEndDate = new Date(boostCreatedAt);
      boostEndDate.setDate(boostEndDate.getDate() + boost.duration);

      if (currentDate > boostEndDate) {
        // If the current date is after the boost end date, set status to 'expired'
        await this.boostModel.findByIdAndUpdate(boost._id, { status: 'expired' }).exec();
      }
    }
  }
}
