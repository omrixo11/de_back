import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';


@Schema()
export class AdsBanner extends Document {

    @Prop({ required: true })
    image: string;

    @Prop({})
    link: string;

    @Prop({ required: true })
    duration: number;

    @Prop({ })
    expirationDate: Date;

    @Prop({ required: true })
    price: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: mongoose.Types.ObjectId;

    @Prop({ enum: ['pending', 'active', 'expired'], default: 'pending' })
    status: string;

    @Prop({ enum: ['unpaid', 'pending', 'paid'], default: 'pending' })
    paymentStatus: string;

    @Prop({ default: false })
    isAccepted: boolean


}

export const AdsBannerSchema = SchemaFactory.createForClass(AdsBanner);
