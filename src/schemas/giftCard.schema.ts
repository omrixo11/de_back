// invoice.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PlanName {
    Basic = 'Basique',
    Professional = 'Professionnel',
    Business = 'Entreprise',
}

export enum GiftCardStatus {
    Unused = 'Unused',
    Used = 'Used',
    Expired = 'Expired'
}

@Schema({ timestamps: true })
export class GiftCard extends Document {

    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    expirationDate: Date;

    @Prop({ required: true, enum: PlanName })
    planName: PlanName;

    @Prop({ enum: GiftCardStatus, default: GiftCardStatus.Unused })
    status: GiftCardStatus;

    @Prop({ required: true, default: 0 })
    balance: number;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    issuedTo: Types.ObjectId;
    
}

export const GiftCardSchema = SchemaFactory.createForClass(GiftCard);
