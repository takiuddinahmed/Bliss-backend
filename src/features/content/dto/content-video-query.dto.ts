import { Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { ContentTypeEnum, SexualityEnum } from '../../common';

export class ContentVideoQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  from = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  count = 10;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsMongoId()
  subCategoryId?: string;

  @IsOptional()
  @IsMongoId()
  channelId?: string;

  @IsOptional()
  @IsEnum(SexualityEnum)
  sexuality?: SexualityEnum;
}
