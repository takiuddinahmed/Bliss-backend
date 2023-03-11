import { Transform } from 'class-transformer';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ContentTypeEnum } from '../../common';

export class ContentQueryDto {
  @IsOptional()
  @Transform(({ value }) => new Types.ObjectId(value))
  categoryId: Types.ObjectId;

  @IsOptional()
  @Transform(({ value }) => new Types.ObjectId(value))
  subCategoryId: Types.ObjectId;

  @IsOptional()
  @IsEnum(ContentTypeEnum)
  contentType: ContentTypeEnum;
}
