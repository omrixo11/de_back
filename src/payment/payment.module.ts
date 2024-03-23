import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from 'src/schemas/payment.schema';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';
import { UserModule } from 'src/user/user.module';
import { Boost, BoostSchema } from 'src/schemas/boost.schema';
import { Article, ArticleSchema } from 'src/schemas/article.schema';
import { AdsBanner, AdsBannerSchema } from 'src/schemas/adsBanner';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { NodeMailerService } from 'src/utils/node.mailer';
import { GiftCard, GiftCardSchema } from 'src/schemas/giftCard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: Boost.name, schema: BoostSchema },
      { name: Article.name, schema: ArticleSchema },
      { name: AdsBanner.name, schema: AdsBannerSchema },
      { name: GiftCard.name, schema: GiftCardSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => InvoiceModule),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, NodeMailerService],
  exports: [PaymentService],
})
export class PaymentModule { }
