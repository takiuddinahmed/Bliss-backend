import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import ContentSchema from './content.model';
import { collectionNames } from '../common';
import { ContentController } from './content.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.content, schema: ContentSchema },
    ]),
  ],
  providers: [ContentService, ContentResolver],
  controllers: [ContentController],
})
export class ContentModule {}
