import { Module } from '@nestjs/common';
import { RestaurantMenuService } from './restaurant-menu.service';
import { RestaurantMenuController } from './restaurant-menu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { SpaceModule } from '../space';
import { RestaurantMenuSchema } from './restaurant-menu.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.restaurantMenu,
        schema: RestaurantMenuSchema,
      },
    ]),
    SpaceModule,
  ],
  controllers: [RestaurantMenuController],
  providers: [RestaurantMenuService],
})
export class RestaurantMenuModule {}
