import { Module } from '@nestjs/common';
import { ModelPictureService } from './model-picture.service';
import { ModelPictureController } from './model-picture.controller';

@Module({
  controllers: [ModelPictureController],
  providers: [ModelPictureService],
})
export class ModelPictureModule {}
