import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { Category, CategorySchema } from './category.model';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.category, schema: CategorySchema },
    ]),
  ],
  providers: [CategoryResolver, CategoryService],
})
export class CategoryModule {}
