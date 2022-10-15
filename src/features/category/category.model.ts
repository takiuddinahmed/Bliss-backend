import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @IsString()
  @Prop({ type: String, required: true, unique: true })
  permalink: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
