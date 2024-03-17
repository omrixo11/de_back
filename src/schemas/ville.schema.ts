import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Quartier } from './quartier.schema';

export enum VilleNames {
    Ariana = 'Ariana',
    Beja = 'Béja',
    BenArous = 'Ben Arous',
    Bizerte = 'Bizerte',
    Gabes = 'Gabès',
    Gafsa = 'Gafsa',
    Jendouba = 'Jendouba',
    Kairouan = 'Kairouan',
    Kasserine = 'Kasserine',
    Kebili = 'Kébili',
    Kef = 'Kef',
    Mahdia = 'Mahdia',
    Manouba = 'Manouba',
    Medenine = 'Médenine',
    Monastir = 'Monastir',
    Nabeul = 'Nabeul',
    Sfax = 'Sfax',
    SidiBouzid = 'Sidi Bouzid',
    Siliana = 'Siliana',
    Sousse = 'Sousse',
    Tataouine = 'Tataouine',
    Tozeur = 'Tozeur',
    Tunis = 'Tunis',
    Zaghouan = 'c',
}

@Schema()
export class Ville extends Document {

    @Prop({ required: true, enum: VilleNames })
    name: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quartier' }] })
    quartiers: Quartier[];

}

export const VilleSchema = SchemaFactory.createForClass(Ville);
