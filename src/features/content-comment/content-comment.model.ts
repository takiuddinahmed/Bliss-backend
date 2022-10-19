import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import {
  collectionNames,
  CommentContentTypeEnum,
  FileData,
  FileDataSchema,
} from '../common';
import {
  LikeDislike,
  LikeDislikeSchema,
} from '../common/models/likeDislike.model';

@Schema()
export class ContentComment {
  @IsMongoId()
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: collectionNames.contentComment,
  })
  contentId: Types.ObjectId | string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: collectionNames.user,
  })
  userId: Types.ObjectId | string;

  @IsEnum(CommentContentTypeEnum)
  @Prop({
    type: String,
    enum: CommentContentTypeEnum,
    default: CommentContentTypeEnum.TEXT,
  })
  commentContentType: CommentContentTypeEnum;

  @IsOptional()
  @IsString()
  @Prop({ type: String })
  text?: string;

  @Prop({ type: FileDataSchema })
  file: FileData;

  @IsOptional()
  @IsString()
  duration: string;

  @Prop({ type: [LikeDislikeSchema], default: [] })
  likeDislikes: LikeDislike[];
}

export type ContentCommentDocument = ContentComment & Document;
export const ContentCommnetSchema =
  SchemaFactory.createForClass(ContentComment);
