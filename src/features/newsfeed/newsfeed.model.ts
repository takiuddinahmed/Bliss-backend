import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import {
  collectionNames,
  ContentTypeEnum,
  FileData,
  FileDataSchema,
  userVirtualOptions,
  VisualityEnum,
} from '../common';
import { LifeStyleEnum } from '../common/enum';
import {
  LikeDislike,
  LikeDislikeSchema,
} from '../common/models/likeDislike.model';
import { ContentView } from '../content/content.model';
import { User } from '../user';

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Newsfeed {
  @Prop({ type: Types.ObjectId, required: true, ref: collectionNames.user })
  userId: Types.ObjectId | string;

  @IsOptional()
  @ApiProperty({ enum: ['true', 'false'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  anonymous?: boolean;

  @ApiProperty({ enum: ContentTypeEnum, isArray: true })
  @IsEnum(ContentTypeEnum, { each: true })
  @Prop({ type: [String], enum: ContentTypeEnum, required: true })
  contentType: ContentTypeEnum[];

  @ApiProperty({ enum: LifeStyleEnum, isArray: true })
  @IsEnum(LifeStyleEnum, { each: true })
  @Prop({ type: [String], required: true })
  lifeStyle: LifeStyleEnum[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  description?: string;

  @Prop({ type: [FileDataSchema] })
  files: FileData[];

  @Prop({ type: [FileDataSchema], default: [] })
  thumbnails?: FileData[];

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

  @Prop({ type: Array<ContentView>, default: [] })
  views: ContentView[];

  // for typing
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export type NewsfeedDocument = HydratedDocument<Newsfeed>;
export const NewsfeedSchema = SchemaFactory.createForClass(Newsfeed);
NewsfeedSchema.virtual('user', userVirtualOptions);

export interface NewsfeedFiles {
  files?: Express.Multer.File[];
  thumbnails?: Express.Multer.File[];
}
