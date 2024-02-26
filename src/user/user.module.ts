// user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';
import { PaymentModule } from 'src/payment/payment.module';
import { Article, ArticleSchema } from 'src/schemas/article.schema';

@Module({
  imports: [
    PaymentModule,
    MongooseModule.forFeature([

      { name: User.name, schema: UserSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: Article.name, schema: ArticleSchema },
      
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
