import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import ContentSchema, { Content } from './content.model';
import { collectionNames } from '../common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.content, schema: ContentSchema },
    ]),
  ],
  providers: [ContentService, ContentResolver],
})
export class ContentModule {}
