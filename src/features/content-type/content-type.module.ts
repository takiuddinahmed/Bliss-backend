import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentTypeController } from './content-type.controller';
import { ContentType, ContentTypeSchema } from './content-type.model';
import { ContentTypeService } from './content-type.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContentType.name, schema: ContentTypeSchema },
    ]),
  ],
  controllers: [ContentTypeController],
  providers: [ContentTypeService],
})
export class ContentTypeModule {}
