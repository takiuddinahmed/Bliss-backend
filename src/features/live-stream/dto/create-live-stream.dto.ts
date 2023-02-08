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
import { Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { LifeStyleEnum } from '../../common/enum';
import { Audience, Status } from '../live-stream.model';
import { Prop } from '@nestjs/mongoose';

export class AudienceDto implements Readonly<AudienceDto> {
  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  _id: Types.ObjectId | string;

  @ApiProperty()
  @IsMongoId()
  userId: Types.ObjectId | string;

  @IsEnum(Status)
  @ValidateIf((obj, value) => value != null)
  @ApiProperty()
  @Prop({ type: String, required: true })
  status: Status;

  @IsOptional()
  @ApiProperty({ enum: ['true', 'false'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
  @IsBoolean()
  isDeleted?: boolean;
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
