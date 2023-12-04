import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';


@Schema()
export class Quartier extends Document {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    longitude: string;

    @Prop({ required: true })
    latitude: string;

}

export const QuartierSchema = SchemaFactory.createForClass(Quartier);
