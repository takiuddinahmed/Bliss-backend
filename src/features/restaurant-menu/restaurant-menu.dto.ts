import { OmitType, PartialType } from '@nestjs/mapped-types';
import { RestaurantMenu } from './restaurant-menu.model';

export class CreateRestaurantMenuDto extends OmitType(RestaurantMenu, [
  'userId',
] as const) {
  userId: string;
}
export class UpdateRestaurantMenuDto extends PartialType(
  CreateRestaurantMenuDto,
) {}
