import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleSchema } from 'src/schemas/article.schema';
import { Model } from 'mongoose';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import * as Jimp from 'jimp';

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private articleModel: Model<Article>) { }

  async createArticle(createArticleDto: CreateArticleDto, imageFiles: Express.Multer.File[]): Promise<Article> {
    const createdArticle = new this.articleModel(createArticleDto);
    createdArticle.images = await this.saveArticleImages(imageFiles);
    return await createdArticle.save();
  }

  async uploadImages(id: string, imageFiles: Express.Multer.File[]): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      console.log('File not found');
    }

    article.images = await this.saveArticleImages(imageFiles);
    return article.save();
  }


  private async saveArticleImages(imageFiles: Express.Multer.File[]): Promise<string[]> {
    const savedImages: string[] = [];
    const mediaFolderPath = path.join(__dirname, '..', '..', 'media', 'articles-images');
  
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
  
      const image = await Jimp.read(imageFile.buffer);
      const watermark = await Jimp.read('media/water-marks/waterMark1.png'); // water mark path
  
      // Calculate the size of the watermark to cover the entire image while maintaining the original aspect ratio
      const watermarkWidth = image.getWidth();
      const watermarkHeight = (watermarkWidth / watermark.getWidth()) * watermark.getHeight();
  
      // Resize watermark
      watermark.resize(watermarkWidth, watermarkHeight);
  
      // Composite the watermark onto the image at the center
      const x = (image.getWidth() - watermark.getWidth()) / 2;
      const y = (image.getHeight() - watermark.getHeight()) / 2;
      image.composite(watermark, x, y);
  
      const imageFileName = `${Date.now()}_${imageFile.originalname}`;
      const imagePath = path.join(mediaFolderPath, imageFileName);
  
      // Save the image with watermark
      await image.writeAsync(imagePath);
      savedImages.push(imageFileName);
    }
  
    return savedImages;
  }

  async findAllWithImages(): Promise<Article[]> {
    const articles = await this.articleModel.find().exec();
  
    for (const article of articles) {
      if (!article.images) {
        article.images = await this.saveArticleImages([]);
      }
    }
  
    const articlesWithImages = articles.map((article) => {
      const images = article.images.map((filename) => {
        return `http://localhost:5001/media/articles-images/${filename}`;
      });
  
      return {
        ...article.toJSON(),
        images,
      };
    });
  
    return articlesWithImages;
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
