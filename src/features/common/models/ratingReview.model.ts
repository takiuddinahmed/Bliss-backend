import { PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Types } from 'mongoose';
import { collectionNames } from '../config/collectionNames.config';
@Schema({ timestamps: true })
export class RatingReview {
  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: Types.ObjectId;

  @ApiProperty()
  @Transform(({ value }: { value: string | number }) =>
    value && typeof value === 'string' ? Number(value) : value,
  )
  @IsNumber({})
  @Min(1)
  @Max(5)
  @Prop({ type: 'Number', default: 1 })
  rating: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: 'String' })
  review: string;
}
export type RatingReviewDocument = RatingReview & Document;
export const RatingReviewSchema = SchemaFactory.createForClass(RatingReview);

export class CreateRatingReviewDto extends RatingReview {}
export class UpdateRatingReviewDto extends PartialType(CreateRatingReviewDto) {}
