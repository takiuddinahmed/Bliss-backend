import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { collectionNames, FileData, FileDataSchema } from '../common';
import { Types } from 'mongoose';
import {
  LikeDislike,
  LikeDislikeSchema,
} from '../common/models/likeDislike.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  RatingReview,
  RatingReviewSchema,
} from '../common/models/ratingReview.model';
import { AskQueAns, AskQueAnsSchema } from '../common/models/askQue.model';
import { RestaurantCategory } from './restaurant.type';

export class OpenCloseTime {
  @ApiProperty()
  @Prop({ type: String })
  openTime: string;
  @ApiProperty()
  @Prop({ type: String })
  closeTime: string;
}
@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: Types.ObjectId | string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Prop({ type: [String], default: [] })
  contactNumber?: string[];

  @ApiProperty({ type: () => OpenCloseTime })
  @IsOptional()
  @IsObject()
  @Prop({ type: OpenCloseTime, default: {} })
  openCloseTime?: OpenCloseTime;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  rulesAndRegulations?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  website?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  location?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String })
  address?: string;

  @ApiProperty({ type: 'array', items: { type: 'File' }, default: [] })
  @Prop({ type: Array<FileData>, default: [] })
  photoGallery: FileData[];

  @ApiProperty({ type: 'array', items: { type: 'File' }, default: [] })
  @Prop({ type: Array<FileData>, default: [] })
  videos: FileData[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  speciality?: string;

  @ApiProperty({ type: 'File' })
  @Prop({ type: FileDataSchema })
  logo?: FileData;

  @ApiProperty({ type: 'File' })
  @Prop({ type: FileDataSchema })
  banner?: FileData;

  @Prop({ type: String })
  permalink: string;

  @Prop([{ type: Types.ObjectId, ref: collectionNames.user }])
  followers: Types.ObjectId[];

  @Prop({ type: [LikeDislikeSchema], default: [] })
  likeDislikes: LikeDislike[];

  @Prop({ type: [RatingReviewSchema], default: [] })
  ratingReviews: RatingReview[];

  @Prop({ type: [AskQueAnsSchema], default: [] })
  askQueAns: AskQueAns[];

  @ApiProperty({ enum: RestaurantCategory })
  @IsArray()
  @Prop({
    type: [String],
    required: true,
    // enum: RestaurantCategory,
  })
  restaurantCategory: RestaurantCategory[];
}

export type RestaurantDocument = Restaurant & Document;

export const restaurantSchema = SchemaFactory.createForClass(Restaurant);

export interface RestaurantFiles {
  logo: Express.Multer.File[];
  banner: Express.Multer.File[];
  photoGallery: Express.Multer.File[];
  videos: Express.Multer.File[];
}
