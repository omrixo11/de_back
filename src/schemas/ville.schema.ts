import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Quartier } from './quartier.schema';


@Schema()
export class Ville extends Document {

    @Prop({ required: true })
    name: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quartier' }] })
    quartiers: Quartier[];

}

export const VilleSchema = SchemaFactory.createForClass(Ville);
