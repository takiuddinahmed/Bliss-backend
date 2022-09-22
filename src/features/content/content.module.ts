import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';

@Module({
  providers: [ContentService, ContentResolver],
})
export class ContentModule {}
