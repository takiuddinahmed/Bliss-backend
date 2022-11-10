import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { collectionNames, FileData, FileDataSchema } from '../common';
import { Types } from 'mongoose';
import {
  councilorFee,
  councilorServiceType,
  CouncilorType,
} from '../common/enum/councilor.enum';
import {
  LikeDislike,
  LikeDislikeSchema,
} from '../common/models/likeDislike.model';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export type CouncilorDocument = Councilor & Document;

@Schema({ timestamps: true })
export class Councilor {
  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  country: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  state: string;

  @ApiProperty({ type: 'String', description: 'MongoId' })
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: collectionNames.user,
  })
  userId: Types.ObjectId | string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  officeAddress: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  openingHours: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  mobile: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: { value: string }) =>
    value && typeof value === 'string' ? value.toLowerCase() : value,
  )
  @Prop({ type: String, required: true })
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, required: false })
  websiteLink?: string;

  @ApiProperty({ enum: councilorFee })
  @IsEnum(councilorFee)
  @Prop({ type: String, required: true, enum: councilorFee })
  serviceFee: councilorFee;

  @ApiProperty({ enum: CouncilorType })
  @IsEnum(CouncilorType)
  @Prop({ type: String, enum: CouncilorType })
  councilorType: CouncilorType;

  @ApiProperty({ enum: councilorServiceType })
  @IsEnum(councilorServiceType)
  @Prop({ type: String, required: true, enum: councilorServiceType })
  serviceType: councilorServiceType;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: false })
  aboutYourSelf: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: false })
  serviceDetails: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: false })
  rulesRegulation: string;

  @ApiProperty({ type: 'File' })
  @Prop({ type: FileDataSchema, default: {} })
  profilePic?: FileData;

  @ApiProperty({ type: 'array', items: { type: 'File' } })
  @Prop({ type: [FileDataSchema], default: [] })
  thumbnails?: FileData[];

  @ApiProperty({ enum: ['true', 'false'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
  @IsBoolean()
  @Prop({ type: Boolean, required: true })
  acceptTerms: boolean;

  @Prop({ type: Array<Types.ObjectId>, ref: collectionNames.user, default: [] })
  followers: Types.ObjectId[];

  @Prop({ type: [LikeDislikeSchema], default: [] })
  likeDislikes: LikeDislike[];
}

export const CouncilorSchema = SchemaFactory.createForClass(Councilor);

export interface CouncilorFiles {
  profilePic?: Express.Multer.File[];
  thumbnails?: Express.Multer.File[];
}
