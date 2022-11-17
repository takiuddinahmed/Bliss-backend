import { Module } from '@nestjs/common';
import { RestaurantMenuService } from './restaurant-menu.service';
import { RestaurantMenuController } from './restaurant-menu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { SpaceModule } from '../space';
import { RestaurantMenuSchema } from './restaurant-menu.model';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.restaurantMenu,
        schema: RestaurantMenuSchema,
      },
    ]),
    SpaceModule,
    RestaurantsModule,
  ],
  controllers: [RestaurantMenuController],
  providers: [RestaurantMenuService],
})
export class RestaurantMenuModule {}
