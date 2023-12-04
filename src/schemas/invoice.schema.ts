// invoice.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Plan } from './plan.schema';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {

  @Prop({ required: true })
  invoiceNumber: string;

  @Prop({ type: String, ref: 'User', required: true })
  user: string;

  @Prop({ type: String, ref: 'Plan', required: true })
  Plan: string;

  @Prop({ required: true })
  dateIssued: Date;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true })
  paymentDate: Date;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: false })
  isPaid: boolean;

}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
