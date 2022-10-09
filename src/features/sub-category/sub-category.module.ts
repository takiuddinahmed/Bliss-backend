import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryResolver } from './sub-category.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { SubCategorySchema } from './sub-category.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.subCategory,
        schema: SubCategorySchema,
      },
    ]),
  ],
  providers: [SubCategoryResolver, SubCategoryService],
})
export class SubCategoryModule {}
