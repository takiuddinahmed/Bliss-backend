import { OmitType, PartialType } from '@nestjs/mapped-types';
import { RestaurantMenu } from './restaurant-menu.model';

export class CreateRestaurantMenuDto extends RestaurantMenu {}
export class UpdateRestaurantMenuDto extends PartialType(
  CreateRestaurantMenuDto,
) {}
