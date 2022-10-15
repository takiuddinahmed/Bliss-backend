import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { CategorySchema } from './category.model';
import { CategoryService } from './category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.category, schema: CategorySchema },
    ]),
  ],
  providers: [CategoryService],
})
export class CategoryModule {}
