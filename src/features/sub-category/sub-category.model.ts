import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { collectionNames } from '../common';

@ObjectType()
@Schema()
export class SubCategory {
  @Field(() => ID)
  _id: string;

  @Prop({ type: String, required: true })
  @Field(() => String)
  name: string;

  @Prop({ type: String, required: true, unique: true })
  @Field(() => String)
  permalink: string;

  @Prop({ type: Types.ObjectId, ref: collectionNames.category })
  @Field(() => String)
  categoryId: string;
}

export type SubCategoryDocument = SubCategory & Document;
export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
