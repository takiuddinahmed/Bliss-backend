import { PartialType } from '@nestjs/mapped-types';
import { SubCategory } from './sub-category.model';

export class CreateSubCategoryDto extends SubCategory {}
export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}