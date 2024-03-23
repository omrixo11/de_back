import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Boost } from './boost.schema';

@Schema({ timestamps: true })
export class Payment extends Document {

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: ['success', 'failure', 'pending'] })
    status: string;

    @Prop({ required: true })
    transactionId: string;

    @Prop({ required: true })
    paymentMethod: string;

    @Prop()
    description: string;

    @Prop()
    callbackUrlSuccess: String;

    @Prop()
    callbackUrlFailure: String;

    @Prop({ type: Types.ObjectId, ref: 'Plan' })
    planId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Boost' })
    boostId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'AdsBanner' })
    adsBannerId: Types.ObjectId;

    @Prop({ })
    isYearlyBilling: boolean;



}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
