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
import { RegionModule } from './region/region.module';
import { QuartierModule } from './quartier/quartier.module';
import { PaymentModule } from './payment/payment.module';
import { ContactModule } from './contact/contact.module';
import { BoostModule } from './boost/boost.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/real"),
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
    RegionModule,
    QuartierModule,
    PaymentModule,
    ContactModule,
    BoostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
