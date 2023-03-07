import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { collectionNames, FileData } from '../common';
import { LifeStyleEnum } from '../common/enum';
import { RelationshipEnum } from '../common/enum/relationship.enum';
import { WeekDayEnum } from '../common/enum/week-day.enum';
import { ModelGallery } from '../model-gallery/model-gallery.model';

export enum ModelStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
}

export class AvailableTime {
  @ApiProperty()
  @IsString()
  time: string;

  @ApiProperty({ enum: WeekDayEnum })
  @IsEnum(WeekDayEnum)
  day: WeekDayEnum;
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class ModelProfile {
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

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Prop({ type: Number })
  age: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  aboutMe: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Prop({ type: Number })
  height: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Prop({ type: Number })
  weight: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  vitalStats: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RelationshipEnum)
  @Prop({ type: String, enum: RelationshipEnum })
  relationshipStatus: RelationshipEnum;

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
  @Prop({ type: FileData, default: {} })
  video: FileData;

  @ApiProperty({ type: 'File' })
  @Prop({ type: FileData, default: {} })
  image: FileData;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsMongoId()
  @Prop({ type: Types.ObjectId })
  membershipTierId?: Types.ObjectId | string;

  @Prop({ type: Date })
  startedAt?: Date | string;

  @Prop({ type: String, unique: true, slug: 'profileName', permanent: true })
  permalink: string;

  @Prop({ type: String, enum: ModelStatus, default: ModelStatus.INACTIVE })
  status: ModelStatus;
}

export type ModelProfileDocument = HydratedDocument<ModelProfile>;
export const ModelProfileSchema = SchemaFactory.createForClass(ModelGallery);

export interface ModelProfileFiles {
  image?: Express.Multer.File[];
  video?: Express.Multer.File[];
}
