import { PartialType } from '@nestjs/mapped-types';
import { Restaurant } from './restaurant.model';

export class CreateRestaurantDto extends Restaurant {}
export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
