import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SearchArticlesDto } from './dto/search-article.dto';
import { Article, ArticleSchema } from 'src/schemas/article.schema';
import { Model } from 'mongoose';
import { promises as fsPromises } from 'fs';
import { User } from 'src/schemas/user.schema';
import { Types } from 'mongoose'; // Import the Types namespace
import { PropertyType } from 'src/schemas/article.schema';
import * as path from 'path';
import * as Jimp from 'jimp';
import { Quartier } from 'src/schemas/quartier.schema';
import { Ville } from 'src/schemas/ville.schema';

interface PopulatedUser {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImg: string;
  // include other fields as needed
}

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Ville.name) private villeModel: Model<Ville>, // Assuming you have a Ville model
    @InjectModel(Quartier.name) private quartierModel: Model<Quartier>, // Assuming you have a Quartier model
  ) { }

  async createArticle(
    createArticleDto: CreateArticleDto,
    imageFiles: Express.Multer.File[],
    userId: string,
  ): Promise<Article> {
    // Fetch the user from the database
    const user = await this.userModel.findById(userId).populate('plan').exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Declare userArticlesCount outside of the conditional block
    let userArticlesCount = 0;

    // Check if the user has a plan associated with them
    if (!user.plan) {
      // If the user does not have a plan, limit the number of posts to 2
      userArticlesCount = await this.articleModel.countDocuments({ user: userId }).exec();
      if (userArticlesCount >= 3) {
        throw new UnauthorizedException('User without a plan can only post 3 articles');
      }
    } else {
      // Determine the maximum post limit for the user's plan
      const maxPostsAllowed = user.plan ? user.plan.maxPosts : 3;
      // Fetch the number of articles already posted by the user
      userArticlesCount = await this.articleModel.countDocuments({ user: userId }).exec();
      // Compare the number of articles posted with the maximum post limit
      if (userArticlesCount >= maxPostsAllowed) {
        throw new UnauthorizedException('User has reached the maximum number of posts allowed');
      }
    }

    // Proceed with creating the article
    const createdArticle = new this.articleModel({
      ...createArticleDto,
      user: userId,
    });

    createdArticle.images = await this.saveArticleImages(imageFiles);
    const savedArticle = await createdArticle.save();

    // Update the user's articles array only if the article was successfully created
    user.articles.push(savedArticle._id);
    await user.save();

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
      .populate('ville')
      .populate('quartier')
      .populate('boost')
      .sort({ createdAt: -1 })
      .exec();

    for (const article of articles) {
      if (!article.images || article.images.length === 0) {
        article.images = await this.saveArticleImages([]);
      }
    }

    const articlesWithImages = articles.map((article) => {
      const images = article.images.map((filename) => {
        // return `https://dessa.ovh/media/articles-images/${filename}`;
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
      .populate('ville')
      .populate('quartier')
      .populate('boost')
      .sort({ createdAt: -1 })
      .exec();
    for (const article of articles) {
      if (!article.images || article.images.length === 0) {
        article.images = await this.saveArticleImages([]);
      }
    }

    const articlesWithImages = articles.map((article) => {
      const images = article.images.map((filename) => {
        // return `https://dessa.ovh/media/articles-images/${filename}`;
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
      .populate('ville')
      .populate('quartier')
      .populate('boost')
      .exec();

    if (!article) {
      return null;
    }

    if (!article.images || article.images.length === 0) {
      article.images = await this.saveArticleImages([]);
    }

    const images = article.images.map((filename) => {
      // return `https://dessa.ovh/media/articles-images/${filename}`;
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

  async removeUserArticle(articleId: string, userId: string): Promise<void> {
    // Convert string IDs to MongoDB ObjectId
    const userObjectId = new Types.ObjectId(userId);
    const articleObjectId = new Types.ObjectId(articleId);

    // Find the article to ensure it exists and belongs to the user
    const article = await this.articleModel.findOne({ _id: articleObjectId, user: userObjectId });
    if (!article) {
      throw new NotFoundException(`Article with id ${articleId} not found or does not belong to the user`);
    }

    // Before removing the article, delete its images from the filesystem
    if (article.images && article.images.length > 0) {
      await this.deleteArticleImages(article.images);
    }

    // Remove the article
    await this.articleModel.findByIdAndRemove(articleObjectId);

    // Update the user's articles array
    await this.userModel.findByIdAndUpdate(
      userObjectId,
      { $pull: { articles: articleObjectId } },
      { new: true } // Return the modified document rather than the original by default
    );

    console.log(`Article ${articleId} removed from user ${userId}`);
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

  private appendImageUrls(articles: Article[]): any[] {
    return articles.map(article => {
      const images = article.images.map(filename => {
        // Adjust the base URL as needed, depending on your environment
        return `http://localhost:5001/media/articles-images/${filename}`;
        // For production, you might switch to something like:
        // return `https://dessa.ovh/media/articles-images/${filename}`;
      });

      return {
        ...article.toJSON(),
        images,
      };
    });
  }

  async searchArticles(searchQuery: string): Promise<Article[]> {
    try {
      const articles = await this.articleModel.find({
        $or: [
          { title: { $regex: new RegExp(searchQuery, 'i') } }, // Case-insensitive search in the title field
          { description: { $regex: new RegExp(searchQuery, 'i') } }, // Case-insensitive search in the description field
          // Add more fields for searching as needed
        ]
      })
        .populate('user')
        .populate('ville')
        .populate('quartier')
        .sort({ createdAt: -1 })
        .exec();

      // Optionally, you can populate images and format the response similar to other methods

      return this.appendImageUrls(articles);
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  }

  async getByVille(ville: string): Promise<Article[]> {
    return this.articleModel
      .find({ ville })
      .populate('user')
      .populate('quartier')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getByQuartier(quartier: string): Promise<Article[]> {
    return this.articleModel
      .find({ quartier })
      .populate('user')
      .populate('ville')
      .sort({ createdAt: -1 })
      .exec();
  }

  async incrementViewsCount(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    article.viewsCount += 1;
    await article.save();

    return article;
  }

  async getViewsCount(id: string): Promise<number> {
    const article = await this.articleModel.findById(id).exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article.viewsCount;
  }

  async getTotalViewsCountForUser(userId: string): Promise<number> {
    // Fetch the user by ID
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      return 0;
    }

    // Ensure the user has articles
    if (user.articles.length === 0) {
      console.log('User has no articles:', userId);
      return 0;
    }

    // Initialize total views count
    let totalViewsCount = 0;

    // Fetch each article by ID and sum their views count
    for (const articleId of user.articles) {
      const article = await this.articleModel.findById(articleId).exec();
      if (article) {
        totalViewsCount += article.viewsCount;
      }
    }
    return totalViewsCount;
  }

  async countUserArticles(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    // console.log('User:', user); // Log the user object
    // console.log('User articles count:', user.articles.length); // Log the count of user articles
    return user.articles.length;
  }

  async countFavoriteArticles(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    // console.log('User:', user); // Log the user object
    // console.log('Favorite articles count:', user.favoriteArticles.length); // Log the count of favorite articles
    return user.favoriteArticles.length;
  }

  async findSimilarArticles(ville: Types.ObjectId, quartier: Types.ObjectId, propertyType: PropertyType[], currentArticleId?: string): Promise<Article[]> {

    const queryConditions: any = {
      ville,
      quartier,
      propertyType: { $in: [propertyType] }, // Assuming propertyType is a single value and not an array in this context
    };

    // Exclude the current article from the results if an ID is provided
    if (currentArticleId) {
      queryConditions._id = { $ne: currentArticleId };
    }


    const similarArticles = await this.articleModel.find(queryConditions)
      .populate('user')
      .populate('ville')
      .populate('quartier')
      .sort({ createdAt: -1 })
      .exec();

    // Process each article to ensure it has images
    const articlesWithImages = await Promise.all(similarArticles.map(async (article) => {
      if (!article.images || article.images.length === 0) {

        article.images = await this.saveArticleImages([]);
      }

      const images = article.images.map((filename) => {
        // return `https://dessa.ovh/media/articles-images/${filename}`;
        return `http://localhost:5001/media/articles-images/${filename}`;
      });

      return {
        ...article.toJSON(),
        images,
      };
    }));

    return articlesWithImages;
  }

  async getTotalViewsByVilleForUser(userId: string): Promise<any[]> {
    const aggregationPipeline = [
      { $match: { user: new Types.ObjectId(userId) } },
      { $group: { _id: '$ville', totalViews: { $sum: '$viewsCount' } } },
      {
        $lookup: {
          from: this.villeModel.collection.name, // Dynamically get the collection name
          localField: '_id',
          foreignField: '_id',
          as: 'villeDetails'
        }
      },
      { $unwind: '$villeDetails' },
      {
        $project: {
          villeName: '$villeDetails.name',
          totalViews: 1
        }
      }
    ];

    const result = await this.articleModel.aggregate(aggregationPipeline).exec();
    return result;
  }

  async getTotalViewsByQuartierForUser(userId: string): Promise<any[]> {
    const aggregationPipeline = [
      { $match: { user: new Types.ObjectId(userId) } },
      { $group: { _id: '$quartier', totalViews: { $sum: '$viewsCount' } } },
      {
        $lookup: {
          from: this.quartierModel.collection.name, // Dynamically get the collection name
          localField: '_id',
          foreignField: '_id',
          as: 'quartierDetails'
        }
      },
      { $unwind: '$quartierDetails' },
      {
        $project: {
          quartierName: '$quartierDetails.name',
          totalViews: 1
        }
      }
    ];

    const result = await this.articleModel.aggregate(aggregationPipeline).exec();
    return result.map(item => ({
      quartierName: item.quartierName,
      totalViews: item.totalViews
    }));
  }
}
