import { PartialType } from '@nestjs/mapped-types';
import { RestaurantBooking } from './restaurant-booking.model';

export class CreateRestaurantBookingDto extends RestaurantBooking {}
export class UpdateRestaurantBookingDto extends PartialType(
  CreateRestaurantBookingDto,
) {}
