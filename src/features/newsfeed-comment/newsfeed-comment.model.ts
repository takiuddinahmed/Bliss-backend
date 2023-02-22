import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { HydratedDocument, PromiseProvider, Types } from 'mongoose';
import {
  collectionNames,
  CommentContentTypeEnum,
  FileData,
  FileDataSchema,
  userVirtualOptions,
} from '../common';
import {
  LikeDislike,
  LikeDislikeSchema,
} from '../common/models/likeDislike.model';

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class NewsfeedComment {
  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  anonymous?: boolean;

  @ApiProperty({ type: String })
  @IsMongoId()
  @Prop({ type: Types.ObjectId, required: true, ref: collectionNames.newsfeed })
  newsfeedId: Types.ObjectId | string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: collectionNames.user,
  })
  userId: Types.ObjectId | string;

  @ApiProperty({
    default: CommentContentTypeEnum.TEXT,
    enum: CommentContentTypeEnum,
  })
  @IsOptional()
  @IsEnum(CommentContentTypeEnum)
  @Prop({
    type: String,
    enum: CommentContentTypeEnum,
    default: CommentContentTypeEnum.TEXT,
  })
  commentContentType: CommentContentTypeEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String })
  text?: string;

  @ApiProperty({ type: String, format: 'binary' })
  @Prop({ type: FileData })
  file?: FileData;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  duration?: string;

  @Prop({ type: [LikeDislikeSchema], default: [] })
  likeDislikes: LikeDislike[];
}

export type NewsfeedCommentDocument = HydratedDocument<NewsfeedComment>;
export const NewsfeedCommentSchema =
  SchemaFactory.createForClass(NewsfeedComment);

NewsfeedCommentSchema.virtual('user', userVirtualOptions);
