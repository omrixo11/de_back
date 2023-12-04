// user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class Admin extends Document {

  @Prop()
  name: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop({ required: true, select: true })
  password: string;
  
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.pre('save', async function (next: any): Promise<void> {
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