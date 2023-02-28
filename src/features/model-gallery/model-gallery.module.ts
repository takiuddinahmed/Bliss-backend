import { Module } from '@nestjs/common';
import { ModelGalleryService } from './model-gallery.service';
import { ModelGalleryController } from './model-gallery.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { ModelGallerySchema } from './model-gallery.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.modelGallery, schema: ModelGallerySchema },
    ]),
  ],
  controllers: [ModelGalleryController],
  providers: [ModelGalleryService],
})
export class ModelGalleryModule {}
