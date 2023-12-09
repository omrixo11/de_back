import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Ville } from './ville.schema';

export enum RegionNames {

  Ariana = 'Ariana',
  Béja = 'Béja',
  BenArous = 'Ben Arous',
  Bizerte = 'Bizerte',
  Gabès = 'Gabès',
  Gafsa = 'Gafsa',
  Jendouba = 'Jendouba',
  Kairouan = 'Kairouan',
  Kasserine = 'Kasserine',
  Kébili = 'Kébili',
  Kef = 'Kef',
  Mahdia = 'Mahdia',
  Manouba = 'Manouba',
  Médenine = 'Médenine',
  Monastir = 'Monastir',
  Nabeul = 'Nabeul',
  Sfax = 'Sfax',
  SidiBouzid = 'Sidi Bouzid',
  Siliana = 'Siliana',
  Sousse = 'Sousse',
  Tataouine = 'Tataouine',
  Tozeur = 'Tozeur',
  Tunis = 'Tunis',
  Zaghouan = 'Zaghouan',

}

@Schema()
export class Region extends Document {
  
  @Prop({ required: true, enum: RegionNames })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ville' }] }) 
  villes: Ville[];
  
}

export const RegionSchema = SchemaFactory.createForClass(Region);
