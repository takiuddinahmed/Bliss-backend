import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { LifeStyleEnum } from '../../common/enum';
import { Audience, Status } from '../live-stream.model';
import { Prop } from '@nestjs/mongoose';

export class AudienceDto implements Readonly<AudienceDto> {
  @ApiProperty()
  @IsMongoId()
  userId: Types.ObjectId | string;

  @IsEnum(Status)
  @ValidateIf((obj, value) => value != null)
  @ApiProperty()
  @Prop({ type: String, required: true })
  status: Status;
}

export class CreateLiveStreamDto implements Readonly<CreateLiveStreamDto> {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsMongoId()
  categoryId: Types.ObjectId | string;

  @ApiProperty({
    enum: LifeStyleEnum,
  })
  @IsEnum(LifeStyleEnum)
  @ValidateIf((obj, value) => value != null)
  lifeStyle: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty({
    type: [AudienceDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AudienceDto)
  audiences: [Audience];
}
