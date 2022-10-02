import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
@ObjectType({ description: 'category' })
export class Category {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  @Field(() => String)
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
