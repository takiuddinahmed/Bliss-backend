import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { collectionNames } from '../common';

export enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, default: ROLE.USER })
  role: ROLE;

  @Prop({ type: String })
  country: string;

  @Prop({ type: Types.ObjectId, ref: collectionNames.channel })
  channelId: string | Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
