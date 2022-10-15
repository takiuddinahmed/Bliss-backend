import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';
import { collectionNames, FileData } from '../common';

@ObjectType()
@Schema()
export class Channel {
  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: Types.ObjectId | string;

  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @IsString()
  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  permalink: string;

  @Prop({ type: FileData })
  logo: FileData;

  @Prop({ type: FileData })
  banner: FileData;
}

export interface ChannelFiles {
  logo?: Express.Multer.File[];
  banner?: Express.Multer.File[];
}

export type ChannelDocument = Channel & Document;

export const ChannelSchema = SchemaFactory.createForClass(Channel);

ChannelSchema.virtual('user', {
  ref: collectionNames.user,
  localField: 'userId',
  foreignField: '_id',
});
