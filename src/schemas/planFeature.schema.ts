

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({ timestamps: true })
export class PlanFeature extends Document {

    @Prop({ required: true })
    description: string;

}

export const PlanFeatureSchema = SchemaFactory.createForClass(PlanFeature);
export type PlanFeatureDocument = PlanFeature & Document;
