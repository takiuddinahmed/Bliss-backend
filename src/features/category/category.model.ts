import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { FileData } from '../common';
import { ContentTypeEnum, LifeStyleEnum } from '../common/enum';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  info?: string;

  @ApiProperty({ enum: LifeStyleEnum, isArray: true })
  @IsEnum(LifeStyleEnum, { each: true })
  @Prop({ type: [String], required: true })
  lifeStyle: LifeStyleEnum[];

  @ApiProperty({ enum: ContentTypeEnum, isArray: true })
  @IsEnum(ContentTypeEnum, { each: true })
  @Prop({ type: [String], enum: ContentTypeEnum, required: true })
  contentType: ContentTypeEnum[];

  @ApiProperty({ required: false })
  @Prop({ type: FileData, default: {} })
  image?: FileData;

  @Prop({
    type: String,
    unique: true,
    slug: 'name',
    permanent: true,
  })
  permalink: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
