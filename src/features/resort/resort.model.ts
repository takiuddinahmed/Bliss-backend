import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import {
  collectionNames,
  FileData,
  FileDataSchema,
  userVirtualOptions,
} from '../common';
import {
  RatingReview,
  RatingReviewSchema,
} from '../common/models/ratingReview.model';
import { View } from '../common/models/view.model';
import ContentSchema from '../content/content.model';

@Schema({ timestamps: true })
export class Resort {
  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: Types.ObjectId | string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @IsMongoId()
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: collectionNames.resortType,
  })
  resortTypeId: Types.ObjectId | string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  location?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  country?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  bookingAddress?: string;

  @ApiProperty({ type: 'array', items: { type: 'File' }, default: [] })
  @Prop({ type: Array<FileData>, default: [] })
  images: FileData[];

  @ApiProperty({ type: 'array', items: { type: 'File' }, default: [] })
  @Prop({ type: Array<FileData>, default: [] })
  packageImages: FileData[];

  @ApiProperty({ type: 'array', items: { type: 'File' }, default: [] })
  @Prop({ type: Array<FileData>, default: [] })
  videos: FileData[];

  @ApiProperty({ type: 'File' })
  @Prop({ type: FileDataSchema })
  banner?: FileData;

  @Prop({ type: String })
  permalink: string;

  @Prop({ type: [RatingReviewSchema], default: [] })
  ratingReviews: RatingReview[];

  @Prop({ type: Array<View>, default: [] })
  views: View[];
}

export type ResortDocument = Resort & Document;
export type ResortDocumentWithId = ResortDocument & {
  _id: Types.ObjectId;
};

const ResortSchema = SchemaFactory.createForClass(Resort);

ResortSchema.virtual('user', userVirtualOptions);
ResortSchema.virtual('resortType', {
  ref: collectionNames.resortType,
  localField: 'resortTypeId',
  foreignField: '_id',
  justOne: true,
  autopopulate: true,
});

export default ContentSchema;

export interface ResortFiles {
  images?: Express.Multer.File[];
  videos?: Express.Multer.File[];
  banner?: Express.Multer.File[];
  packageImages?: Express.Multer.File[];
}
