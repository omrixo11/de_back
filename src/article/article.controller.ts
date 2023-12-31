// In article.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Request, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/user/user-auth.guard';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @Post()
  @UseGuards(AuthGuard)
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

  @Get()
  findAll() {
    return this.articleService.findAllWithImages();
  }

  @Get('user-articles')
  @UseGuards(AuthGuard)
  findUserArticles(@Request() req: any) {
    const userId = req.user._id;
    return this.articleService.findUserArticles(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
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
  @UseGuards(AuthGuard)
  removeUserArticle(@Param('id') id: string, @Request() req: any) {
    const userId = req.user._id;
    return this.articleService.removeUserArticle(userId, id);
  }

  
}
