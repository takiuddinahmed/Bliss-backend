import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class ContentQueryDto {
  @IsOptional()
  @Transform(({ value }) => new Types.ObjectId(value))
  categoryId: Types.ObjectId;

  @IsOptional()
  @Transform(({ value }) => new Types.ObjectId(value))
  subCategoryId: Types.ObjectId;
}
