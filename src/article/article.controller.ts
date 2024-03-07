// In article.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Request, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/user/user-auth.middleware';
import { SearchArticlesDto } from './dto/search-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFiles() imageFiles: Express.Multer.File[],
    @Request() req: any,
  ) {
    const userId = req.user._id;
    return this.articleService.createArticle(createArticleDto, imageFiles, userId);
  }

  @Post(':id/upload-images')
  @UseInterceptors(FilesInterceptor('images', 10))
  uploadImages(@Param('id') id: string, @UploadedFiles() imageFiles: Express.Multer.File[]) {
    return this.articleService.uploadImages(id, imageFiles);
  }

  @Get('search')
  search(@Query('q') searchQuery: string) {
    return this.articleService.searchArticles(searchQuery);
  }


  @Get('by-ville/:ville')
  getByVille(@Param('ville') ville: string) {
    return this.articleService.getByVille(ville);
  }

  @Get('by-quartier/:quartier')
  getByQuartier(@Param('quartier') quartier: string) {
    return this.articleService.getByQuartier(quartier);
  }

  @Get()
  findAll() {
    return this.articleService.findAllWithImages();
  }

  @Get('user-articles')
  @UseGuards(JwtAuthGuard)
  findUserArticles(@Request() req: any) {
    const userId = req.user._id;
    return this.articleService.findUserArticles(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Get('user/:userId/article-count')
  @UseGuards(JwtAuthGuard)
  getUserArticleCount(@Param('userId') userId: string) {
    return this.articleService.countUserArticles(userId);
  }

  @Get(':id/views')
  @UseGuards(JwtAuthGuard)
  getViewsCount(@Param('id') id: string) {
    return this.articleService.getViewsCount(id);
  }

  @Get('user/:userId/total-views')
  @UseGuards(JwtAuthGuard)
  getTotalViewsCountForUser(@Param('userId') userId: string) {
    return this.articleService.getTotalViewsCountForUser(userId);
  }

  @Get('user/:userId/favorite-article-count')
  @UseGuards(JwtAuthGuard)
  getUserFavoriteArticleCount(@Param('userId') userId: string) {
    return this.articleService.countFavoriteArticles(userId);
  }

  @Get(':id/similar')
  async findSimilar(@Param('id') id: string) {
    const article = await this.articleService.findOne(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return this.articleService.findSimilarArticles(article.ville, article.quartier, article.propertyType, id);
  }

  @Get('user/:userId/views-by-ville')
  @UseGuards(JwtAuthGuard)
  getTotalViewsByVilleForUser(@Param('userId') userId: string) {
    return this.articleService.getTotalViewsByVilleForUser(userId);
  }

  @Get('user/:userId/views-by-quartier')
  @UseGuards(JwtAuthGuard)
  getTotalViewsByQuartierForUser(@Param('userId') userId: string) {
    return this.articleService.getTotalViewsByQuartierForUser(userId);
  }



  @Patch(':id/increment-views')
  incrementViewsCount(@Param('id') id: string) {
    return this.articleService.incrementViewsCount(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }

  @Delete(':id/user-article')
  @UseGuards(JwtAuthGuard)
  removeUserArticle(@Param('id') id: string, @Request() req: any) {
    const userId = req.user._id;
    return this.articleService.removeUserArticle(userId, id);
  }

}
