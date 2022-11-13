import { Module } from '@nestjs/common';
import { RestaurantMenuService } from './restaurant-menu.service';
import { RestaurantMenuController } from './restaurant-menu.controller';

@Module({
  controllers: [RestaurantMenuController],
  providers: [RestaurantMenuService]
})
export class RestaurantMenuModule {}
