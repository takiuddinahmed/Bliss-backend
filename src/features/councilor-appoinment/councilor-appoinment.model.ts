import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator';
import { CouncilorAppoinmentType } from './councilor-appoinment-type.enum';
import { collectionNames } from '../common';

@Schema({ timestamps: true })
export class CouncilorAppoinment {
  @ApiProperty({ type: 'mongoId' })
  @IsMongoId()
  @Prop({ type: Types.ObjectId, ref: collectionNames.councilor })
  councilorId: Types.ObjectId | string;

  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: Types.ObjectId | string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @IsNumber()
  memberCount: number;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ enum: CouncilorAppoinmentType })
  @IsEnum(CouncilorAppoinmentType)
  @Prop({ type: String, enum: CouncilorAppoinmentType, required: true })
  appoinmentType: CouncilorAppoinmentType;

  @ApiProperty()
  @IsDateString()
  @Prop({ type: Date })
  dateTime: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String })
  details: string;

  @Prop({ type: Boolean, default: false })
  accepted: boolean;
}
export type CouncilorAppoinmentDocument = CouncilorAppoinment & Document;
export type CouncilorAppoinmentDocumnetWithId = CouncilorAppoinmentDocument & {
  _id: Types.ObjectId;
};

export const CouncilorAppoinmentSchema =
  SchemaFactory.createForClass(CouncilorAppoinment);
