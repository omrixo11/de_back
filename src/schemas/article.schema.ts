// subscription.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';



export enum PropertyType {

    Appartement = 'Appartement',
    Bureau = 'Bureau',
    Chateau = 'Château',
    Commerce = 'Commerce',
    Duplex = 'Duplex',
    Maison = 'Maison',
    Loft = 'Loft',
    Ferme = 'Ferme',
    Terrain = 'Terrain',
    Studio = 'Studio',
    Villa = 'Villa',

}

export enum EtatPropriete {

    Neuf = 'Neuf',
    BonEtat = 'BonEtat',
    ARenover = 'ARenover',
    EnConstruction = 'EnConstruction',

}

export enum NaturePropriete {

    Habitation = 'Habitation',
    Profesionnels = 'Profesionnels',
    Vacances = 'Vacances',
    Terrain = 'Terrain',
    Industrielle = 'Industrielle',

}

export enum TransactionType {

    Location = 'Location',
    Vente = 'Vente',

}

@Schema({ timestamps: true })
export class Article extends Document {

    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    // enum
    @Prop({ required: true, type: [String], enum: Object.values(PropertyType) })
    propertyType: PropertyType[];

    @Prop({ required: true, type: [String], enum: Object.values(NaturePropriete) })
    naturePropriete: NaturePropriete[];

    @Prop({ required: true })
    etatPropriete: EtatPropriete;

    @Prop({ required: true })
    transactionType: TransactionType;


    ////adress
    @Prop({ required: true })
    adress: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Region' })
    region: Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ville' })
    ville: Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Quartier' })
    quartier: Types.ObjectId;

    ////


    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({})
    notes: string;

    @Prop({ required: true })
    bathrooms: number;

    @Prop({ required: true })
    bedrooms: number;

    @Prop({ required: true })
    surface: number;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    availableFrom: Date;

    @Prop({ type: [String] })
    images: string[];

    @Prop({})
    costumId: string;

    //Extra Options:::::
    @Prop({ default: false })
    isClimatisation: boolean;

    @Prop({ default: false })
    isChauffageCentral: boolean;

    @Prop({ default: false })
    isPlaceParcking: boolean;

    @Prop({ default: false })
    isGarage: boolean;

    @Prop({ default: false })
    isAscenceur: boolean;

    @Prop({ default: false })
    isCameraSurveillance: boolean;

    @Prop({ default: false })
    isCuisineEquiper: boolean;

    @Prop({ default: false })
    isFour: boolean;

    @Prop({ default: false })
    isHotte: boolean;

    @Prop({ default: false })
    isConcierge: boolean;

    @Prop({ default: false })
    isTerrasse: boolean;

    @Prop({ default: false })
    isPiscine: boolean;

    @Prop({ default: false })
    isJardin: boolean;

    @Prop({ default: false })
    isPorteBlinder: boolean;

    @Prop({ default: false })
    isVueSurMer: boolean;

    @Prop({ default: false })
    isMachineLaver: boolean;

    @Prop({ default: false })
    isCheminer: boolean;

    @Prop({ default: false })
    isRefrigerateur: boolean

    @Prop({ default: false })
    isMicroOndes: boolean;

    @Prop({ default: false })
    isInternet: boolean;

    @Prop({ default: false })
    isChambreRangement: boolean;

    @Prop({ default: false })
    isAnimauxDomestiquesAutorises: boolean

    //other options
    @Prop({ default: true })
    isAvailable: boolean;

    @Prop({ default: false })
    isAccepted: boolean;

}

export const ArticleSchema = SchemaFactory.createForClass(Article);
