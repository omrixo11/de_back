import { Module } from '@nestjs/common';
import { GiftCardService } from './gift-card.service';
import { GiftCardController } from './gift-card.controller';
import { GiftCard, GiftCardSchema } from 'src/schemas/giftCard.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GiftCard.name, schema: GiftCardSchema },
    ])
  ],
  controllers: [GiftCardController],
  providers: [GiftCardService],
})
export class GiftCardModule { }
