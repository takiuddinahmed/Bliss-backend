import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  collectionNames,
  ContentTypeEnum,
  FileData,
  FileDataSchema,
} from '../common';
import { Types } from 'mongoose';
import {
  councilorFee,
  councilorServiceType,
} from '../common/enum/councilor.enum';
import {
  LikeDislike,
  LikeDislikeSchema,
} from '../common/models/likeDislike.model';

export type CouncilorDocument = Councilor & Document;

@Schema({ timestamps: true })
export class Councilor {
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @IsString()
  @Prop({ type: String, required: true })
  country: string;

  @IsString()
  @Prop({ type: String, required: true })
  state: string;

  @IsOptional()
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: collectionNames.user,
  })
  userId: Types.ObjectId | string;

  @IsString()
  @Prop({ type: String, required: true })
  officeAddress: string;

  @IsString()
  @Prop({ type: String, required: true })
  openingHours: string;

  @IsString()
  @Prop({ type: String, required: true })
  mobile: string;

  @IsEmail()
  @Prop({ type: String, required: true })
  email: string;

  @IsOptional()
  @IsString()
  @Prop({ type: String, required: false })
  websiteLink: string;

  @IsEnum(councilorFee)
  @Prop({ type: String, required: true, enum: councilorFee })
  serviceFee: councilorFee;

  @IsEnum(councilorServiceType)
  @Prop({ type: String, required: true, enum: councilorServiceType })
  serviceType: councilorServiceType;

  @IsString()
  @Prop({ type: String, required: false })
  aboutYourSelf: string;

  @IsString()
  @Prop({ type: String, required: false })
  serviceDetails: string;

  @IsString()
  @Prop({ type: String, required: false })
  rulesRegulation: string;

  @IsOptional()
  @Prop({ type: FileDataSchema })
  profilePic: FileData;

  @IsOptional()
  @Prop({ type: [FileDataSchema], default: [] })
  thumbnails: FileData[];

  @IsBoolean()
  @Prop({ type: Boolean, required: true })
  acceptTerms: boolean;

  @IsOptional()
  @Prop({ type: Array<Types.ObjectId>, ref: collectionNames.user, default: [] })
  folllower: Types.ObjectId[];

  @IsOptional()
  @Prop({ type: [LikeDislikeSchema], default: [] })
  likeDislikes: LikeDislike[];
}

export const CouncilorSchema = SchemaFactory.createForClass(Councilor);
