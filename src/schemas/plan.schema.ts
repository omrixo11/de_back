// subscription.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PlanFeature } from './planFeature.schema';

export enum PlanName {
    Basic = 'Basique',
    Professional = 'Professionnel',
    Business = 'Entreprise',
}

@Schema({ timestamps: true })
export class Plan extends Document {

    @Prop({ required: true })
    planName: PlanName;

    @Prop({ required: true, min: 0 })
    monthPrice: number;
    
    @Prop({ required: true, min: 0 })
    yearPrice: number;

    @Prop({ required: true })
    maxPosts: number;

    @Prop({ required: true })
    description: string;

    @Prop({ })
    planFeatures: PlanFeature[];

}

export const PlanSchema = SchemaFactory.createForClass(Plan);
export type PlanDocument = Plan & Document;
