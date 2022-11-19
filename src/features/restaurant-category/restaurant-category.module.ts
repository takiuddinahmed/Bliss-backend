import { Module } from '@nestjs/common';
import { RestaurantCategoryService } from './restaurant-category.service';
import { RestaurantCategoryController } from './restaurant-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { RestaurantCategorySchema } from './restaurant-category.model';
import { SpaceModule } from '../space';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.restaurantCatogory,
        schema: RestaurantCategorySchema,
      },
    ]),
    SpaceModule,
  ],
  controllers: [RestaurantCategoryController],
  providers: [RestaurantCategoryService],
})
export class RestaurantCategoryModule {}
