import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { collectionNames, FileData, FileDataSchema } from 'src/features/common';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  LikeDislike,
  LikeDislikeSchema,
} from '../common/models/likeDislike.model';
import {
  RatingReview,
  RatingReviewSchema,
} from '../common/models/ratingReview.model';

@Schema({ timestamps: true })
export class RestaurantMenu {
  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: Types.ObjectId | string;

  @ApiProperty({ type: 'Mongo Id' })
  @IsMongoId()
  @Prop({ type: Types.ObjectId, ref: collectionNames.restaurant })
  restaurantId: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  quantity: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  price: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String })
  category: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty({ enum: ['true', 'false'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
  @IsBoolean()
  @Prop({ type: Boolean })
  featured: boolean;

  @ApiProperty({ enum: ['true', 'false'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
  @IsBoolean()
  @Prop({ type: Boolean })
  popular: boolean;

  @ApiProperty({ type: 'File' })
  @Prop({ type: FileDataSchema })
  image: FileData;

  @ApiProperty({ type: 'array', items: { type: 'File' }, default: [] })
  @Prop({ type: [FileDataSchema], default: [] })
  videos: FileData[];

  @ApiProperty({ type: 'array', items: { type: 'File' }, default: [] })
  @Prop({ type: [FileDataSchema], default: [] })
  thumnails: FileData[];

  @Prop({ type: String })
  permalink: string;

  @Prop({ type: [LikeDislikeSchema], default: [] })
  likeDislikes: LikeDislike[];

  @Prop({ type: [RatingReviewSchema], default: [] })
  ratingReviews: RatingReview[];
}

export type RestaurantMenuDocument = RestaurantMenu & Document;
export const RestaurantMenuSchema =
  SchemaFactory.createForClass(RestaurantMenu);

export interface RestaurantMenuFiles {
  image: Express.Multer.File[];
  videos: Express.Multer.File[];
  thumnails: Express.Multer.File[];
}
