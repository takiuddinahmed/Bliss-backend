import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { ContentController } from './content.controller';
import ContentSchema from './content.model';
import { ContentService } from './content.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.content, schema: ContentSchema },
    ]),
  ],
  providers: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}
