import { Module } from '@nestjs/common';
import { GiftCardService } from './gift-card.service';
import { GiftCardController } from './gift-card.controller';
import { GiftCard, GiftCardSchema } from 'src/schemas/giftCard.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GiftCard.name, schema: GiftCardSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [GiftCardController],
  providers: [GiftCardService],
})
export class GiftCardModule { }
