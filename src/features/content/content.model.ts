import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import {
  collectionNames,
  ContentTypeEnum,
  FileData,
  SexualityEnum,
  VisualityEnum,
} from '../common';

@Schema()
export class Content {
  @Prop({ type: Types.ObjectId, required: true, ref: collectionNames.user })
  userId: Types.ObjectId | string;

  @IsArray()
  @Prop([
    { type: Types.ObjectId, required: true, ref: collectionNames.category },
  ])
  categoryId: Types.ObjectId;

  @IsOptional()
  @IsArray()
  @Prop([
    { type: Types.ObjectId, required: true, ref: collectionNames.category },
  ])
  subCategoryId: Types.ObjectId;

  @IsMongoId()
  @Prop({ type: Types.ObjectId, required: true, ref: collectionNames.channel })
  channelId: Types.ObjectId;

  @IsEnum(SexualityEnum)
  @Prop({
    type: String,
    enum: SexualityEnum,
    required: true,
    default: SexualityEnum.STRIGHT,
  })
  sexuality: SexualityEnum;

  @IsEnum(ContentTypeEnum)
  @Prop({ type: String, required: true, enum: ContentTypeEnum })
  contentType: ContentTypeEnum;

  @IsString()
  @Prop({ type: String, default: '' })
  title: string;

  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: FileData })
  file: FileData;

  @Prop({ type: Array<FileData>, default: [] })
  thumbnails: FileData[];

  @IsOptional()
  @IsNumber()
  @Prop({ type: Number })
  duration: number;

  @IsOptional()
  @IsEnum(VisualityEnum)
  @Prop({
    type: String,
    enum: VisualityEnum,
    required: true,
    default: VisualityEnum.PRIVATE,
  })
  visualiTy: VisualityEnum;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  permalink: string;
}

export interface ContentFiles {
  file?: Express.Multer.File[];
  thumbnails?: Express.Multer.File[];
}
export interface ContentFilesData {
  file?: FileData;
  thumbnails?: FileData[];
}

export type ContentDocument = Content & Document;
export type ContentDocumentWithId = ContentDocument & { _id: Types.ObjectId };

const ContentSchema = SchemaFactory.createForClass(Content);

export default ContentSchema;
