import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  permalink: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
