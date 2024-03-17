// boost.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Newsletter extends Document {


    @Prop({
        type: [{ type: String, required: true }],
        validate: [emailArrayValidator, 'Invalid email']
      })
      emails: string[];

}
function emailArrayValidator(value: string[]): boolean {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return value.every(email => re.test(email));
}
export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);
