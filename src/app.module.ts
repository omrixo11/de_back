import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAuthModule } from './auth/user/user-auth.module';
import { ArticleModule } from './article/article.module'
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { VilleModule } from './ville/ville.module';
import { QuartierModule } from './quartier/quartier.module';
import { ContactModule } from './contact/contact.module';
import { BoostModule } from './boost/boost.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { PaymentModule } from './payment/payment.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GiftCardModule } from './gift-card/gift-card.module';
import { AdsBannersModule } from './ads-banners/ads-banners.module';

@Module({


  imports: [
    MongooseModule.forRoot(

      //Dev DataBase:
      "mongodb://localhost:27017/real",
      // Prod DataBase be careful:
      // "mongodb://dali:OTSomriMedAli1997Dessa@51.75.26.134:27017/dessaVPSdb?authSource=admin"

    ),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: '1234567890@qwertyuiop',
      signOptions: { expiresIn: '2h' },
    }),
    UserAuthModule,
    UserModule,
    ArticleModule,
    PlanModule,
    VilleModule,
    QuartierModule,
    ContactModule,
    BoostModule,
    NewsletterModule,
    PaymentModule,
    GiftCardModule,
    AdsBannersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
