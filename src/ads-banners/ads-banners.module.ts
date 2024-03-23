import { Module } from '@nestjs/common';
import { AdsBannersService } from './ads-banners.service';
import { AdsBannersController } from './ads-banners.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdsBanner, AdsBannerSchema } from 'src/schemas/adsBanner';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdsBanner.name, schema: AdsBannerSchema },
    ])
  ],
  controllers: [AdsBannersController],
  providers: [AdsBannersService],
  exports: [AdsBannersService],

})
export class AdsBannersModule {}
