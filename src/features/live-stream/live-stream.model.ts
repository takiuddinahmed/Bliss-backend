import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Types } from 'mongoose';
import { collectionNames } from '../common';
import { ApiProperty } from '@nestjs/swagger';
import { LifeStyleEnum } from '../common/enum';
import { Transform } from 'class-transformer';

export enum Status {
  JOINED = 'JOINED',
  INVITED = 'INVITED',
  LEFT = 'LEFT',
}

type AudienceDocument = Audience & Document;

@Schema()
export class Audience {
  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: Types.ObjectId | string;

  @IsEnum(Status)
  @ValidateIf((obj, value) => value != null)
  @ApiProperty()
  @Prop({ type: String, required: true })
  status: Status;
}

const AudienceSchema = SchemaFactory.createForClass(Audience);

export type LiveStreamDocument = LiveStream & Document;
@Schema({ timestamps: true })
export class LiveStream {
  @IsMongoId()
  @Prop({
    type: Types.ObjectId,
    ref: collectionNames.user,
    required: true,
  })
  userId: Types.ObjectId | string;

  @IsString()
  @Prop({ type: String, required: true })
  title: string;

  @IsOptional()
  @Prop({ type: String, required: true, unique: true })
  permalink: string;

  @IsOptional()
  @Prop({ type: String, unique: true })
  url: string;

  @IsString()
  @Prop({ type: String, required: true })
  description: string;

  @IsMongoId()
  @Prop({
    type: Types.ObjectId,
    ref: collectionNames.category,
    required: true,
  })
  categoryId: string;

  @IsEnum(LifeStyleEnum)
  @ValidateIf((obj, value) => value != null)
  @ApiProperty()
  @Prop({ type: String, required: true })
  lifeStyle: LifeStyleEnum;

  @IsOptional()
  @ApiProperty({ enum: ['true', 'false'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  isPrivate?: boolean;

  @IsOptional()
  @Prop({
    type: [AudienceSchema],
    default: [],
  })
  audiences: AudienceDocument[];
}

export const LiveStreamSchema = SchemaFactory.createForClass(LiveStream);

// To go live I have to select category -> Done
// To go live I have to select lifestyle -> Done
// To go live I have to give live title -> Done
// To go live I have to give live description -> Done
// To go live I can add search tag - already we have search tag
// To go live I can select - visibility - public/private -> Done
// If it is private - I can select user to who will be live -> Done
// I can share live link so any logged-in user can visit the link and join on the live

// ************* Will Do later ******************
// On the live people can live chat - make it  a separate module
// On the live people can throw money - we have separate token system. - think about this later first think about live
// On the live I can see who is the host
// After live is finished it will add to podcast -
