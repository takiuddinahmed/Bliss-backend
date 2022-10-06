import { Module } from '@nestjs/common';
import { ContentTypeService } from './content-type.service';
import { ContentTypeResolver } from './content-type.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentType, ContentTypeSchema } from './content-type.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContentType.name, schema: ContentTypeSchema },
    ]),
  ],
  providers: [ContentTypeResolver, ContentTypeService],
})
export class ContentTypeModule {}