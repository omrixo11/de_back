import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GiftCard, GiftCardSchema, GiftCardStatus } from 'src/schemas/giftCard.schema';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';
import { UpdateGiftCardDto } from './dto/update-gift-card.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class GiftCardService {
  constructor(
    @InjectModel(GiftCard.name) private readonly giftCardModel: Model<GiftCard>,
  ) {}

  async create(createGiftCardDto: CreateGiftCardDto): Promise<GiftCard> {
    const createdGiftCard = new this.giftCardModel(createGiftCardDto);
    return createdGiftCard.save();
  }

  async findAll(): Promise<GiftCard[]> {
    return this.giftCardModel.find().exec();
  }

  async findOne(id: string): Promise<GiftCard> {
    const giftCard = await this.giftCardModel.findById(id).exec();
    if (!giftCard) {
      throw new NotFoundException(`Gift card with id ${id} not found`);
    }
    return giftCard;
  }

  async update(id: string, updateGiftCardDto: UpdateGiftCardDto): Promise<GiftCard> {
    const updatedGiftCard = await this.giftCardModel.findByIdAndUpdate(id, updateGiftCardDto, { new: true }).exec();
    if (!updatedGiftCard) {
      throw new NotFoundException(`Gift card with id ${id} not found`);
    }
    return updatedGiftCard;
  }

  async remove(id: string): Promise<void> {
    const result = await this.giftCardModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Gift card with id ${id} not found`);
    }
  }

  @Cron('0 0 * * *') 
  async checkAndExpireGiftCards() {
    const now = new Date();
    await this.giftCardModel.updateMany(
      { expirationDate: { $lt: now }, status: { $ne: GiftCardStatus.Expired } },
      { $set: { status: GiftCardStatus.Expired } }
    );
  }
  
}
