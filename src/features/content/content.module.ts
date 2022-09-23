import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Content } from './content.model';
import { CategorySchema } from '../category/category.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Content.name, schema: CategorySchema }]),
  ],
  providers: [ContentService, ContentResolver],
})
export class ContentModule {}
