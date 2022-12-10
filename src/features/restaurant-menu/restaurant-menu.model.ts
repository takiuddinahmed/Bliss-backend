import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  collectionNames,
  FileData,
  FileDataSchema,
  userVirtualOptions,
} from 'src/features/common';
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

@Schema({ timestamps: true, toJSON: { virtuals: true } })
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
  @IsMongoId()
  @Prop({ type: Types.ObjectId, ref: collectionNames.restaurantCatogory })
  restaurantCategoryId: Types.ObjectId | string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty({ enum: ['true', 'false'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
  @ApiProperty({ enum: ['true', 'false'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
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
  thumbnails: FileData[];

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

RestaurantMenuSchema.virtual('user', userVirtualOptions);
RestaurantMenuSchema.virtual('restaurant', {
  ref: collectionNames.restaurant,
  localField: 'restaurantId',
  foreignField: '_id',
  autopopulate: true,
  justOne: true,
  options: {
    select: 'name website logo banner permalink followers',
  },
});

export interface RestaurantMenuFiles {
  image: Express.Multer.File[];
  videos: Express.Multer.File[];
  thumbnails: Express.Multer.File[];
}
