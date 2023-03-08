import { Module } from '@nestjs/common';
import { ModelCategoryService } from './model-category.service';
import { ModelCategoryController } from './model-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { ModelCategorySchema } from './model-category.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.modelCategory, schema: ModelCategorySchema },
    ]),
  ],
  controllers: [ModelCategoryController],
  providers: [ModelCategoryService],
})
export class ModelCategoryModule {}
