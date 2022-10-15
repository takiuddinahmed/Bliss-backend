import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
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
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
