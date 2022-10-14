import { Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { collectionNames } from '../common';


export type SubCategoryDocument = SubCategory & Document;
@Schema({ timestamps: true })
export class SubCategory {

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


export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
