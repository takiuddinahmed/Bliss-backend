import { Prop, Schema } from '@nestjs/mongoose';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { collectionNames, CommentContentTypeEnum, FileData } from '../common';

@Schema()
export class ContentComment {
  @IsMongoId()
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: collectionNames.contentComment,
  })
  contentId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: collectionNames.contentComment,
  })
  userId: Types.ObjectId;

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

  file: FileData;

  duration: number;

  likeDislike: object;
}
