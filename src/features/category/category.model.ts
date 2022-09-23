import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SexualityEnum } from '../common';

export type CategoryDocument = Category & Document;

@Schema()
@ObjectType({ description: 'category' })
export class Category {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  @Field(() => String)
  name: string;

  @Prop({ type: String, enum: SexualityEnum, required: true })
  @Field(() => String)
  sexuality: SexualityEnum;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
