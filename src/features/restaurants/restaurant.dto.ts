import { PartialType } from '@nestjs/mapped-types';
import { Restaurant } from './restaurant.model';

export class CreateRestaurantDto extends PartialType(Restaurant) {}
export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
