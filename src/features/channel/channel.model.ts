import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { collectionNames, FileData } from '../common';
import { User } from '../user';

@ObjectType()
@Schema()
export class Channel {
  @Field(() => ID)
  _id: string | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  @Field(() => ID)
  userId: Types.ObjectId | string;

  @Prop({ type: String, required: true })
  @Field(() => String)
  name: string;

  @Prop({ type: String, required: true })
  @Field(() => String)
  description: string;

  @Prop({ type: String, required: true })
  @Field(() => String)
  permalink: string;

  @Prop({ type: FileData })
  @Field(() => FileData, { nullable: true })
  logo: FileData;

  @Prop({ type: FileData })
  @Field(() => FileData, { nullable: true })
  banner: FileData;

  @Field(() => User, { nullable: true })
  user: User;
}

export type ChannelDocument = Channel & Document;

export const ChannelSchema = SchemaFactory.createForClass(Channel);

ChannelSchema.virtual('user', {
  ref: collectionNames.user,
  localField: 'userId',
  foreignField: '_id',
});
