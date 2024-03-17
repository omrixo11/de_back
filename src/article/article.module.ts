import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article, ArticleSchema } from 'src/schemas/article.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';
import { UserModule } from 'src/user/user.module';
import { Ville, VilleSchema } from 'src/schemas/ville.schema';
import { Quartier, QuartierSchema } from 'src/schemas/quartier.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Article.name, schema: ArticleSchema },
    { name: User.name, schema: UserSchema },
    { name: Plan.name, schema: PlanSchema },
    { name: Ville.name, schema: VilleSchema },
    { name: Quartier.name, schema: QuartierSchema },

  ]),
    UserModule,
  ],

  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule { }
