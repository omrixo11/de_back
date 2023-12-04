// subscription.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export enum ArticleType {

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

export enum EtatArticle {
    Neuf = 'Neuf',
    Ancien = 'Ancien',
}

export enum TypeExercice {
    Habitation = 'Habitation',
    Profesionnels = 'Profesionnels',
    Vacances = 'Vacances',
}

@Schema({ timestamps: true })
export class Article extends Document {

    // enum
    @Prop({ required: true })
    type: ArticleType;

    @Prop({ required: true })
    etatArticle: EtatArticle;

    @Prop({ required: true })
    typeExercice: TypeExercice;

    // article infos
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    adress: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    bathrooms: number;

    @Prop({ required: true })
    bedrooms: number;

    @Prop({ required: true })
    neighborhood: string

    @Prop({ required: true })
    surface: number;

    @Prop({ required: true })
    price: number;

    // @Prop({ required: true })
    // notenp: string;
    
    //Options:::::
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
    isSecurite: boolean;

    @Prop({ default: false })
    isCuisineEquiper: boolean;

    @Prop({ default: false })
    isFour: boolean;

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
    Cheminer: boolean;

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

    @Prop({ type: [String] })
    images: string[];

}

export const ArticleSchema = SchemaFactory.createForClass(Article);
