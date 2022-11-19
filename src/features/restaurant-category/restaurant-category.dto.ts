import { PartialType } from '@nestjs/mapped-types';
import { RestaurantCategory } from './restaurant-category.model';

export class CreateRestaurantCategoryDto extends RestaurantCategory {}
export class UpdateRestaurantCategoryDto extends PartialType(
  CreateRestaurantCategoryDto,
) {}
