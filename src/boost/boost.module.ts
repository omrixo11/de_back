import { Module } from '@nestjs/common';
import { BoostService } from './boost.service';
import { BoostController } from './boost.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Boost, BoostSchema } from 'src/schemas/boost.schema';
import { Article, ArticleSchema } from 'src/schemas/article.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Boost.name, schema: BoostSchema },
      { name: Article.name, schema: ArticleSchema },
    ])
  ],
  controllers: [BoostController],
  providers: [BoostService],
})
export class BoostModule { }
