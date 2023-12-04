// user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Article, ArticleSchema } from './article.schema';
import { Plan } from './plan.schema';

export enum BillingCycle {
  Monthly = 'monthly',
  Yearly = 'yearly',
}


@Schema({ timestamps: true })
export class User extends Document {

  @Prop({ required: true})
  email: string;

  @Prop({ required: true, validate: { validator: isPasswordValid, message: 'Password must be at least 8 characters long' } })
  password: string;
  
  @Prop({ trim: true })
  firstName: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ trim: true })
  adress: string;

  @Prop({ default: false })
  isOnPlan: boolean;

  @Prop({ type: [ArticleSchema], default: [] }) 
  articles: Article[];

  /////auth conf
  @Prop({ default: null })
  confirmationCode: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  ///reset password
  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;

  //Plan
  @Prop({ type: Types.ObjectId, ref: 'Plan', default: null })
  plan: Plan;

  @Prop({ enum: BillingCycle, default: BillingCycle.Monthly })
  billingCycle: BillingCycle;
  
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