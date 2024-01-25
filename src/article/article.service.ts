import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleSchema } from 'src/schemas/article.schema';
import { Model } from 'mongoose';
import { promises as fsPromises } from 'fs';
import { User } from 'src/schemas/user.schema';
import * as path from 'path';
import * as Jimp from 'jimp';

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async createArticle(
    createArticleDto: CreateArticleDto,
    imageFiles: Express.Multer.File[],
    userId: string,
  ): Promise<Article> {
    const createdArticle = new this.articleModel({
      ...createArticleDto,
      user: userId,
    });

    createdArticle.images = await this.saveArticleImages(imageFiles);
    const savedArticle = await createdArticle.save();

    const user = await this.userModel.findById(userId).exec();
    if (user) {
      user.articles.push(savedArticle._id);
      await user.save();
    }

    return savedArticle;
  }


  async uploadImages(id: string, imageFiles: Express.Multer.File[]): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      console.log('File not found');
    }

    article.images = await this.saveArticleImages(imageFiles);
    return article.save();
  }


  // private async saveArticleImages(imageFiles: Express.Multer.File[]): Promise<string[]> {
  //   const savedImages: string[] = [];
  //   const mediaFolderPath = path.join(__dirname, '..', '..', 'media', 'articles-images');

  //   console.log('Media Folder Path:', mediaFolderPath);

  //   // Ensure the media folder exists
  //   await fsPromises.mkdir(mediaFolderPath, { recursive: true });

  //   if (!imageFiles || !Array.isArray(imageFiles)) {
  //     throw new Error('No valid image files provided.');
  //   }


  //   for (const imageFile of imageFiles) {

  //     if (!imageFile.buffer || !imageFile.originalname) {
  //       console.error('Invalid image file:', imageFile);
  //       continue; // Skip invalid image files
  //     }

  //     const image = await Jimp.read(imageFile.buffer);

  //     const watermark = await Jimp.read('media/water-marks/waterMark1.png'); // water mark path

  //     // Calculate the size of the watermark to cover the entire image while maintaining the original aspect ratio
  //     const watermarkWidth = image.getWidth();
  //     const watermarkHeight = (watermarkWidth / watermark.getWidth()) * watermark.getHeight();

  //     // Resize watermark
  //     watermark.resize(watermarkWidth, watermarkHeight);

  //     // Composite the watermark onto the image at the center
  //     const x = (image.getWidth() - watermark.getWidth()) / 2;
  //     const y = (image.getHeight() - watermark.getHeight()) / 2;
  //     image.composite(watermark, x, y);

  //     const imageFileName = `${Date.now()}_${imageFile.originalname}`;
  //     const imagePath = path.join(mediaFolderPath, imageFileName);

  //     // Save the image with watermark
  //     await image.writeAsync(imagePath);
  //     savedImages.push(imageFileName);
  //   }

  //   return savedImages;
  // }

  private async saveArticleImages(imageFiles: Express.Multer.File[]): Promise<string[]> {
    const savedImages: string[] = [];
    const mediaFolderPath = path.join(__dirname, '..', '..', 'media', 'articles-images');
    const watermarkPath = path.join(__dirname, '..', '..', 'media', 'water-marks', 'waterMark1.png');
  
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
  
      // Crop the image to a specific size (e.g., 270x250)
      const targetWidth = 810;
      const targetHeight = 750;
      image.cover(targetWidth, targetHeight);
  
      // Read the watermark image
      const watermark = await Jimp.read(watermarkPath);
  
      // Calculate the size of the watermark to cover the entire cropped image while maintaining the original aspect ratio
      const watermarkWidth = image.getWidth();
      const watermarkHeight = (watermarkWidth / watermark.getWidth()) * watermark.getHeight();
  
      // Resize watermark
      watermark.resize(watermarkWidth, watermarkHeight);
  
      // Composite the watermark onto the cropped image at the center
      const x = (image.getWidth() - watermark.getWidth()) / 2;
      const y = (image.getHeight() - watermark.getHeight()) / 2;
      image.composite(watermark, x, y);
  
      const imageFileName = `${Date.now()}_${imageFile.originalname}`;
      const imagePath = path.join(mediaFolderPath, imageFileName);
  
      // Save the cropped image with watermark
      await image.writeAsync(imagePath);
      savedImages.push(imageFileName);
    }
  
    return savedImages;
  }
  
  

  async findAllWithImages(): Promise<Article[]> {
    const articles = await this.articleModel
      .find()
      .populate('user')
      .populate('region')
      .populate('ville')
      .populate('quartier')
      .sort({ createdAt: -1 }) // Sort 
      .exec();
  
    for (const article of articles) {
      if (!article.images || article.images.length === 0) {
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
  

  async findUserArticles(userId: string): Promise<Article[]> {
    const articles = await this.articleModel
      .find({ user: userId })
      .populate('user')
      .populate('region')
      .populate('ville')
      .populate('quartier')
      .sort({ createdAt: -1 })
      .exec();
    for (const article of articles) {
      if (!article.images || article.images.length === 0) {
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
    const article = await this.articleModel.findById(id)
      .populate('user')
      .populate('region')
      .populate('ville')
      .populate('quartier')
      .exec();
  
    if (!article) {
      return null; 
    }
  
    if (!article.images || article.images.length === 0) {
      article.images = await this.saveArticleImages([]);
    }
  
    const images = article.images.map((filename) => {
      return `http://localhost:5001/media/articles-images/${filename}`;
    });
  
    const articleWithImages = {
      ...article.toJSON(),
      images,
    };
  
    return articleWithImages;
  }
  

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.articleModel.findByIdAndUpdate(id, updateArticleDto);
  }

  async remove(id: string): Promise<Article> {
    return this.articleModel.findByIdAndRemove(id).exec();
  }

  async removeUserArticle(userId: string, articleId: string): Promise<Article> {
    // Find the article by ID
    const article = await this.articleModel.findById(articleId).exec();
  
    if (!article) {
      console.log('Article not found');
      throw new NotFoundException('Article not found');
    }
  
    // Check if the article belongs to the requesting user
    if (article.user.toString() !== userId) {
      console.log('Unauthorized: User cannot delete this article');
      throw new UnauthorizedException('Unauthorized: User cannot delete this article');
    }
  
    // Remove the associated images
    await this.deleteArticleImages(article.images);
  
    // Remove the article from the user's articles array
    const user = await this.userModel.findById(userId).exec();
    if (user) {
      user.articles = user.articles.filter((userArticle) => userArticle.toString() !== articleId);
      await user.save();
    }
  
    // Remove the article from the database
    return this.articleModel.findByIdAndRemove(articleId).exec();
  }
  

  private async deleteArticleImages(images: string[]): Promise<void> {
    const mediaFolderPath = path.join(__dirname, '..', '..', 'media', 'articles-images');
  
    for (const imageFileName of images) {
      const imagePath = path.join(mediaFolderPath, imageFileName);
  
      try {
        // Delete the image file
        await fsPromises.unlink(imagePath);
        console.log(`Deleted image: ${imageFileName}`);
      } catch (error) {
        console.error(`Error deleting image ${imageFileName}: ${error.message}`);
      }
    }
  }
  

}
