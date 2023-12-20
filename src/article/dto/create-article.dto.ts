import { PropertyType, NaturePropriete, EtatPropriete, TransactionType } from "src/schemas/article.schema";

export class CreateArticleDto {

    user: string;

    propertyType: PropertyType[];
    naturePropriete: NaturePropriete[];
    etatPropriete: EtatPropriete;
    transactionType: TransactionType;

    adress: string;
    region: string; 
    ville: string; 
    quartier: string;

    title: string;
    description: string;
    notes: string;
    bathrooms: number;
    bedrooms: number;
    surface: number;
    price: number;
    availableFrom: Date;
    images: string[];
    costumId: string;

    isClimatisation: boolean;
    isChauffageCentral: boolean;
    isPlaceParcking: boolean;
    isGarage: boolean;
    isAscenceur: boolean;
    isCameraSurveillance: boolean;
    isCuisineEquiper: boolean;
    isFour: boolean;
    isHotte: boolean;
    isConcierge: boolean;
    isTerrasse: boolean;
    isPiscine: boolean;
    isJardin: boolean;
    isPorteBlinder: boolean;
    isVueSurMer: boolean;
    isMachineLaver: boolean;
    isCheminer: boolean;
    isRefrigerateur: boolean;
    isMicroOndes: boolean;
    isInternet: boolean;
    isChambreRangement: boolean;
    isAnimauxDomestiquesAutorises: boolean;

    isAvailable: boolean;
    isAccepted: boolean;
    
}
