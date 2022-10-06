import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FileData } from '../common';

@ObjectType()
@Schema()
export class Channel {
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
}

export type ChannelDocument = Channel & Document;

export const ChannelSchema = SchemaFactory.createForClass(Channel);
