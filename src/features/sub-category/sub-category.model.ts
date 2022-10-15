import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { collectionNames } from '../common';


export type SubCategoryDocument = SubCategory & Document;
@Schema({ timestamps: true })
export class SubCategory {

  @Prop({ type: String, required: true })
  name: string;

  @IsOptional()
  @Prop({ type: String, required: true, unique: true,default: '' })
  permalink: string;

  @Prop({ type: Types.ObjectId, ref: collectionNames.category })
  categoryId: string;
}


export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
