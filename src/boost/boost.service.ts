import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBoostDto } from './dto/create-boost.dto';
import { UpdateBoostDto } from './dto/update-boost.dto';
import { Boost } from 'src/schemas/boost.schema';
import { Model } from 'mongoose';
import { Article } from 'src/schemas/article.schema';


@Injectable()
export class BoostService {
  constructor(
    @InjectModel(Boost.name) private boostModel: Model<Boost>,
    @InjectModel(Article.name) private articleModel: Model<Article> // Make sure you have Article model injected
  ) {}

  async createBoost(createBoostDto: any): Promise<Boost> {
    const createdBoost = new this.boostModel(createBoostDto);
    const savedBoost = await createdBoost.save();

    // After saving the boost, update the corresponding article to reference this boost
    await this.articleModel.findByIdAndUpdate(
      createBoostDto.contentId, // Assuming this is the ID of the article
      { $set: { boost: savedBoost._id } }, // Update the boost field
      { new: true } // Return the updated document
    );

    return savedBoost;
  }
}
