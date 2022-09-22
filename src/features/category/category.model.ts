import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SexualityEnum } from '../common';

export type CategoryDocument = Category & Document;

@Schema()
@ObjectType({ description: 'category' })
export class Category {
  @Field((type) => ID)
  _id: string;

  @Prop({ type: String, required: true })
  @Field((type) => String)
  name: string;

  @Prop({ type: String, enum: SexualityEnum, required: true })
  @Field((type) => String)
  sexuality: SexualityEnum;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
