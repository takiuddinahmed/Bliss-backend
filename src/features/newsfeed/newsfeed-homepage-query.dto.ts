import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ContentTypeEnum } from '../common';
import { LifeStyleEnum } from '../common/enum';

export class NewsfeedHomepageQuery {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
  @IsBoolean()
  anonymous?: boolean;

  @IsOptional()
  @IsEnum(ContentTypeEnum)
  contentType?: ContentTypeEnum;

  @IsOptional()
  @IsEnum(LifeStyleEnum)
  lifeStyle?: LifeStyleEnum;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  from = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  count = 10;
}
