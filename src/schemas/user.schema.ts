// user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Article, ArticleSchema } from './article.schema';
import { Plan } from './plan.schema';
import { Invoice } from './invoice.schema';

export enum BillingCycle {
  Monthly = 'monthly',
  Yearly = 'yearly',
}

@Schema({ timestamps: true })
export class User extends Document {

  @Prop({ unique: true })
  email: string;

  @Prop({ validate: { validator: isPasswordValid, message: 'Password must be at least 8 characters long' } })
  password: string;

  @Prop({ trim: true })
  firstName: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop({})
  phoneNumber: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ trim: true })
  companyName: string;

  @Prop({ trim: true })
  aboutMe: string;

  @Prop({ default: null })
  profileImg: string;

  @Prop({ default: false })
  isOnPlan: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Article' }] })
  articles: Types.ObjectId[];

  @Prop({ default: 0 })
  articleCount: number;

  //social media
  @Prop({ default: null })
  instagramUrl: string;

  @Prop({ default: null })
  facebookUrl: string;

  @Prop({ default: null })
  twitterUrl: string;

  @Prop({ default: null })
  websiteUrl: string;

  /////auth conf
  @Prop({ default: 0 })
  confirmationCode: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  //favoorites:
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Article' }], default: [] })
  favoriteArticles: Types.ObjectId[];

  ///reset password
  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;

  //Plan
  @Prop({ type: Types.ObjectId, ref: 'Plan', default: null })
  plan: Plan;

  @Prop({ default: 5 })
  maxPosts: number;

  @Prop({})
  subscriptionStartDate: Date;

  @Prop()
  subscriptionEndDate: Date;

  @Prop({ enum: ['pending', 'active', 'expired'], default: 'pending' })
  planStatus: string;

  //payment
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Payment', default: null }] })
  paymentHistory: Types.ObjectId[];

  @Prop({ enum: BillingCycle, default: BillingCycle.Monthly })
  billingCycle: BillingCycle;

  //ivoices
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Invoice' }] })
  invoices: Types.ObjectId[] | Invoice[];

  //role
  @Prop({ type: [String], default: ['user'] })
  roles: string[];

}

function isPasswordValid(password: string): boolean {
  return password.length >= 8;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any): Promise<void> {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
