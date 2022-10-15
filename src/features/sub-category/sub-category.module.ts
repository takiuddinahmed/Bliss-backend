import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { SubCategorySchema } from './sub-category.model';
import { SubCategoryResolver } from './sub-category.resolver';
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
  providers: [SubCategoryResolver, SubCategoryService],
})
export class SubCategoryModule {}
