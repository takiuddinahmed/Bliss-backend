import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export type ContentTypeDocument = ContentType & Document;

@Schema()
@ObjectType()
export class ContentType {
  @Field(() => ID)
  _id: Types.ObjectId;

  @IsString()
  @Prop({ type: String, required: true })
  @Field(() => String)
  name: string;

  @IsString()
  @Prop({ type: String })
  @Field(() => String)
  icon: string;

  
}

export const ContentTypeSchema = SchemaFactory.createForClass(ContentType);
