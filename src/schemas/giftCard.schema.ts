// invoice.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PlanName {
    Basic = 'Basique',
    Professional = 'Professionnel',
    Business = 'Entreprise',
}

@Schema({ timestamps: true })
export class GiftCard extends Document {

    @Prop({ required: true })
    code: number;

    @Prop({ required: true })
    expirationDate: Date;

    @Prop({ required: true })
    planName: PlanName;

    @Prop({ default: 1 })
    duration: number

}

export const GiftCardSchema = SchemaFactory.createForClass(GiftCard);
