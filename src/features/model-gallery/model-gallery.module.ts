import { Module } from '@nestjs/common';
import { ModelGalleryService } from './model-gallery.service';
import { ModelGalleryController } from './model-gallery.controller';

@Module({
  controllers: [ModelGalleryController],
  providers: [ModelGalleryService]
})
export class ModelGalleryModule {}
