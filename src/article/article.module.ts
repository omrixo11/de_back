import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article, ArticleSchema } from 'src/schemas/article.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Article.name, schema: ArticleSchema },
    { name: User.name, schema: UserSchema }])],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule { }
