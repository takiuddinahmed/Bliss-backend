import { Module } from '@nestjs/common';
import { RestaurantBookingService } from './restaurant-booking.service';
import { RestaurantBookingController } from './restaurant-booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { RestaurantBookingSchema } from './restaurant-booking.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.restaurantBooking,
        schema: RestaurantBookingSchema,
      },
    ]),
  ],
  controllers: [RestaurantBookingController],
  providers: [RestaurantBookingService],
})
export class RestaurantBookingModule {}
