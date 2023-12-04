import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleSchema } from 'src/schemas/article.schema';
import { Model } from 'mongoose';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private articleModel: Model<Article>) { }

  async createArticle(createArticleDto: CreateArticleDto, imageFiles: Express.Multer.File[]): Promise<Article> {
    const createdArticle = new this.articleModel(createArticleDto);
    createdArticle.images = await this.saveImages(imageFiles);
    return await createdArticle.save();
  }

  async uploadImages(id: string, imageFiles: Express.Multer.File[]): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      console.log('File not found');
    }

    article.images = await this.saveImages(imageFiles);
    return article.save();
  }

  private async saveImages(imageFiles: Express.Multer.File[]): Promise<string[]> {

    const savedImages: string[] = [];
    const mediaFolderPath = path.join(__dirname, '..', '..', 'media', 'images');

    console.log('Media Folder Path:', mediaFolderPath);

    // Ensure the media folder exists
    await fsPromises.mkdir(mediaFolderPath, { recursive: true });

    if (!imageFiles || !Array.isArray(imageFiles)) {
      throw new Error('No valid image files provided.');
    }

    for (const imageFile of imageFiles) {
      if (!imageFile.buffer || !imageFile.originalname) {
        console.error('Invalid image file:', imageFile);
        continue; // Skip invalid image files
      }

      const imageFileName = `${Date.now()}_${imageFile.originalname}`;
      const imagePath = path.join(mediaFolderPath, imageFileName);

      await fsPromises.writeFile(imagePath, imageFile.buffer);
      savedImages.push(imageFileName);
    }

    return savedImages;
  }



  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findOne(id: string): Promise<Article> {
    return this.articleModel.findById(id).exec();
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.articleModel.findByIdAndUpdate(id, updateArticleDto);
  }

  async remove(id: string): Promise<Article> {
    return this.articleModel.findByIdAndRemove(id).exec();
  }
}
