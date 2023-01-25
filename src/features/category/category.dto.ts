import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Category } from './category.model';

export class CreateCategoryDto extends Category {}
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
