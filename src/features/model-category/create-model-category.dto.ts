import { PartialType } from '@nestjs/mapped-types';
import { ModelCategory } from './model-category.model';

export class CreateModelCategoryDto extends ModelCategory {}
export class UpdateModelCategoryDto extends PartialType(
  CreateModelCategoryDto,
) {}
