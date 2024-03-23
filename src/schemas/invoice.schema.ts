// invoice.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {

  @Prop({ required: true })
  invoiceNumber: string;

  @Prop({ required: true })
  userFirstName: string;

  @Prop({ required: true })
  userLastName: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  amount: number;

}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
