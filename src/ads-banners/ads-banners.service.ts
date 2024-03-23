import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAdsBannerDto } from './dto/create-ads-banner.dto';
import { UpdateAdsBannerDto } from './dto/update-ads-banner.dto';
import { AdsBanner } from 'src/schemas/adsBanner';
import * as Jimp from 'jimp';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AdsBannersService {
  constructor(@InjectModel(AdsBanner.name) private adsBannerModel: Model<AdsBanner>) { }

  async create(createAdsBannerDto: CreateAdsBannerDto): Promise<AdsBanner> {
    const createdAdsBanner = new this.adsBannerModel(createAdsBannerDto);
    return createdAdsBanner.save();
  }

  async findAll(): Promise<any[]> {

    const adsBanners = await this.adsBannerModel.find().lean().exec();
    const baseUrl = 'http://localhost:5001/media/ads-banners/';
    // const baseUrl = 'https://dessa.ovh/media/ads-banners/';

    return adsBanners.map(banner => ({
      ...banner,
      imageUrl: `${baseUrl}${banner.image}`,
    }));
  }

  async findAllActive(): Promise<any[]> {

    const adsBanners = await this.adsBannerModel.find({ status: 'active', isAccepted: true }).lean().exec();
    const baseUrl = 'http://localhost:5001/media/ads-banners/';
    // const baseUrl = 'https://dessa.ovh/media/ads-banners/';

    return adsBanners.map(banner => ({
      ...banner,
      imageUrl: `${baseUrl}${banner.image}`,
    }));
  }

  async findOne(id: number): Promise<AdsBanner> {
    return this.adsBannerModel.findById(id).exec();
  }

  async update(id: number, updateAdsBannerDto: UpdateAdsBannerDto): Promise<AdsBanner> {
    return this.adsBannerModel.findByIdAndUpdate(id, updateAdsBannerDto, { new: true }).exec();
  }

  async remove(id: number): Promise<any> {
    return this.adsBannerModel.findByIdAndRemove(id).exec();
  }

  async saveBannerImage(imageFile: Express.Multer.File): Promise<string> {
    const bannersFolderPath = path.join(__dirname, '..', '..', 'media', 'ads-banners');
    await fs.ensureDir(bannersFolderPath);

    if (!imageFile.buffer || !imageFile.originalname) {
      throw new Error('Invalid image file.');
    }

    const image = await Jimp.read(imageFile.buffer);
    const imageFileName = `${Date.now()}_${imageFile.originalname}`;
    const imagePath = path.join(bannersFolderPath, imageFileName);

    await image.writeAsync(imagePath);
    return imageFileName;
  }

  @Cron('0 0 * * *')
  async expireBanners() {
    const now = new Date();
    await this.adsBannerModel.updateMany(
      { expirationDate: { $lt: now }, status: { $ne: 'expired' } },
      { $set: { status: 'expired' } }
    );
  }

}
