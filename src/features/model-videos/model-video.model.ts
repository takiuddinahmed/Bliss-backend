import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import {
  collectionNames,
  Comment,
  FileData,
  FileDataSchema,
  userPopulateSelect,
} from '../common';
import {
  LikeDislike,
  LikeDislikeSchema,
} from '../common/models/likeDislike.model';
import { ContentView } from '../content/content.model';

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class ModelVideo {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: collectionNames.user,
    autopopulate: { select: userPopulateSelect },
  })
  userId: Types.ObjectId | string;

  @ApiProperty()
  @IsMongoId()
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: collectionNames.modelProfile,
    autopopulate: { select: 'profileName' },
  })
  modelProfileId: string | Types.ObjectId;

  @ApiProperty({ type: 'string', isArray: true })
  @IsMongoId({ each: true })
  @Prop([{ type: Types.ObjectId, ref: collectionNames.modelCategory }])
  category: string[] | Types.ObjectId[];

  @ApiProperty()
  @IsString()
  @Prop({ type: String, default: '' })
  title: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: [FileDataSchema], default: [] })
  thumbnails: FileData[];

  @Prop({ type: FileDataSchema })
  video: FileData;

  @Prop({ type: [LikeDislikeSchema], default: [] })
  likeDislikes: LikeDislike[];

  @Prop({ Type: [Types.ObjectId], ref: collectionNames.user, default: [] })
  favorites: Types.ObjectId[] | string[];

  @Prop({ type: Array<ContentView>, default: [] })
  views: ContentView[];

  @Prop({ type: Array<Comment>, default: [] })
  comments: Comment[];
}

export type ModelVideoDocument = HydratedDocument<ModelVideo>;
export const ModelVideoSchema = SchemaFactory.createForClass(ModelVideo);

export interface ModelVideoFiles {
  thumbnails?: Express.Multer.File[];
  video?: Express.Multer.File[];
}
