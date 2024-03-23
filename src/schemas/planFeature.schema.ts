

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({ timestamps: true })
export class PlanFeature extends Document {

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    isIncluded: boolean 

}

export const PlanFeatureSchema = SchemaFactory.createForClass(PlanFeature);
export type PlanFeatureDocument = PlanFeature & Document;
