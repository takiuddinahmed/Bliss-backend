import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { collectionNames, FileData } from '../common';
import { LifeStyleEnum } from '../common/enum';
import { WeekDayEnum } from '../common/enum/week-day.enum';

export class AvailableTime {
  @ApiProperty()
  @IsString()
  time: string;

  @ApiProperty({ enum: WeekDayEnum })
  @IsEnum(WeekDayEnum)
  day: WeekDayEnum;
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class ModelGallery {
  @Prop({
    type: Types.ObjectId,
    required: true,
    unique: true,
    ref: collectionNames.user,
  })
  userId: Types.ObjectId | string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  profileName: string;

  @ApiProperty({ enum: LifeStyleEnum, isArray: true })
  @IsEnum(LifeStyleEnum, { each: true })
  @Prop({ type: [String], required: true })
  lifeStyle: LifeStyleEnum[];

  @ApiProperty()
  @IsMongoId({ each: true })
  @Prop([{ type: Types.ObjectId, ref: collectionNames.category }])
  categoryId: Types.ObjectId[];

  @ApiProperty({ type: [AvailableTime] })
  @IsArray()
  @Prop({ type: Array<AvailableTime>, default: [] })
  availableTimes: AvailableTime[];

  @ApiProperty({ type: 'File' })
  @Prop({ type: Array<FileData>, default: [] })
  basicImages: FileData[];

  @ApiProperty({ type: 'File' })
  @Prop({ type: Array<FileData>, default: [] })
  specialImages: FileData[];

  @ApiProperty({ type: 'File' })
  @Prop({ type: Array<FileData>, default: [] })
  archiveImages: FileData[];

  @ApiProperty({ type: 'File' })
  @Prop({ type: FileData, default: {} })
  video: FileData;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsMongoId()
  @Prop({ type: Types.ObjectId })
  membershipTierId?: Types.ObjectId | string;

  @Prop({ type: Date })
  startedAt?: Date | string;

  @Prop({ type: String, unique: true, slug: 'profileName', permanent: true })
  permalink: string;

  @Prop({ type: Boolean, default: false })
  active: boolean;
}

export type ModelGalleryDocument = HydratedDocument<ModelGallery>;
export const ModelGallerySchema = SchemaFactory.createForClass(ModelGallery);
