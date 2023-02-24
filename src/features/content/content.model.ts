import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import {
  collectionNames,
  ContentTypeEnum,
  FileData,
  FileDataSchema,
  SexualityEnum,
  userVirtualOptions,
  VisualityEnum,
} from '../common';
import {
  LikeDislike,
  LikeDislikeSchema,
} from '../common/models/likeDislike.model';

export class ContentView {
  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: Types.ObjectId | string;
  @Prop({ type: Number, default: 0 })
  viewCount: number;
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Content {
  @Prop({ type: Types.ObjectId, required: true, ref: collectionNames.user })
  userId: Types.ObjectId | string;

  @ApiProperty()
  @IsArray()
  //@IsMongoId()
  @Prop([
    { type: mongoose.Schema.Types.ObjectId, ref: collectionNames.category },
  ])
  categoryId: Types.ObjectId[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Prop([
    { type: Types.ObjectId, required: true, ref: collectionNames.subCategory },
  ])
  subCategoryId?: Types.ObjectId[];

  @ApiProperty()
  @IsMongoId()
  @Prop({ type: Types.ObjectId, required: true, ref: collectionNames.channel })
  channelId: Types.ObjectId;

  @ApiProperty({ enum: SexualityEnum })
  @IsEnum(SexualityEnum)
  @Prop({
    type: String,
    enum: SexualityEnum,
    required: true,
    default: SexualityEnum.STRIGHT,
  })
  sexuality: SexualityEnum;

  @ApiProperty({ enum: ContentTypeEnum })
  @IsEnum(ContentTypeEnum)
  @Prop({ type: String, required: true, enum: ContentTypeEnum })
  contentType: ContentTypeEnum;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, default: '' })
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  description?: string;

  @IsOptional()
  @ApiProperty({ enum: ['true', 'false'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  isFunVideo?: boolean;

  @Prop({ type: FileDataSchema })
  file: FileData;

  @Prop({ type: [FileDataSchema], default: [] })
  thumbnails: FileData[];

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  @Prop({ type: String })
  url?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String })
  duration?: string;

  @ApiProperty({ enum: VisualityEnum })
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

  @Prop({ type: [LikeDislikeSchema], default: [] })
  likeDislikes: LikeDislike[];

  @Prop({ Type: [Types.ObjectId], ref: collectionNames.user, default: [] })
  favorites: Types.ObjectId[] | string[];

  @Prop({ type: Array<ContentView>, default: [] })
  views: ContentView[];

  @Prop({ Type: [Types.ObjectId], ref: collectionNames.user, default: [] })
  library: Types.ObjectId[];
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

ContentSchema.virtual('user', userVirtualOptions);

export default ContentSchema;
