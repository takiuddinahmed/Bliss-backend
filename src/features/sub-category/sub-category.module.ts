import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { SpaceModule } from '../space';
import { SubCategoryController } from './sub-category.controller';
import { SubCategorySchema } from './sub-category.model';
import { SubCategoryService } from './sub-category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.subCategory,
        schema: SubCategorySchema,
      },
    ]),
    SpaceModule,
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
