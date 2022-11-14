import { Module } from '@nestjs/common';
import { RestaurantMenuService } from './restaurant-menu.service';
import { RestaurantMenuController } from './restaurant-menu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { restaurantSchema } from '../restaurants/restaurant.model';
import { SpaceModule } from '../space';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.restaurantMenu,
        schema: restaurantSchema,
      },
    ]),
    SpaceModule,
  ],
  controllers: [RestaurantMenuController],
  providers: [RestaurantMenuService],
})
export class RestaurantMenuModule {}
