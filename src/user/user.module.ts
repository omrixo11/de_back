// user.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';
import { Article, ArticleSchema } from 'src/schemas/article.schema';
import { Payment, PaymentSchema } from 'src/schemas/payment.schema';
import { PaymentModule } from 'src/payment/payment.module';
import { Boost, BoostSchema } from 'src/schemas/boost.schema';
import { AdsBanner, AdsBannerSchema } from 'src/schemas/adsBanner';
import { AdsBannersModule } from 'src/ads-banners/ads-banners.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: Article.name, schema: ArticleSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Boost.name, schema: BoostSchema },
      { name: AdsBanner.name, schema: AdsBannerSchema },
    ]),
    forwardRef(() => PaymentModule),
    forwardRef(() => AdsBannersModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule]
})
export class UserModule { }
