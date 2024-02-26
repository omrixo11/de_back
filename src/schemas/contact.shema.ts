// subscription.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({ timestamps: true })
export class Contact extends Document {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    tele: number;

    @Prop({ required: true })
    message: string;

}

export const ContactSchema = SchemaFactory.createForClass(Contact);
export type ContactDocument = Contact & Document;
