import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { collectionNames, FileData } from '../common';

export type SubCategoryDocument = SubCategory & Document;
@Schema({ timestamps: true })
export class SubCategory {
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @IsOptional()
  @Prop({ type: String, required: true, unique: true, default: '' })
  permalink: string;

  @IsMongoId()
  @Prop({ type: Types.ObjectId, ref: collectionNames.category })
  categoryId: string;

  @ApiProperty({ required: false })
  @Prop({ type: FileData, default: {} })
  image?: FileData;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
