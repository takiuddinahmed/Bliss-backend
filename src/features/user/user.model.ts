import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { collectionNames } from '../common';

export enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type UserDocument = User & Document;

@Schema()
@ObjectType()
export class User {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  @Field(() => String)
  firstName: string;

  @Prop({ type: String, required: true })
  @Field(() => String)
  lastName: string;

  @Prop({ type: String, required: true, unique: true })
  @Field(() => String)
  email: string;

  @Prop({ type: String, required: true })
  @Field(() => String)
  phoneNumber: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, default: ROLE.USER })
  @Field(() => String)
  role: ROLE;

  @Prop({ type: String })
  @Field(() => String)
  country: string;

  @Prop({ type: Types.ObjectId, ref: collectionNames.channel })
  @Field(() => ID, { nullable: true })
  channelId: string | Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
