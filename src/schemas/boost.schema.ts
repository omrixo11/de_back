// boost.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Boost extends Document {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true })
  articleId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  price: number;

  @Prop({ enum: ['carousel', 'classic', 'super'] })
  type: string;

  @Prop({ enum: ['pending', 'active', 'expired'], default: 'pending' })
  status: string;

  @Prop({ enum: ['unpaid', 'pending', 'paid'], default: 'pending' })
  paymentStatus: string;


}

export const BoostSchema = SchemaFactory.createForClass(Boost);
