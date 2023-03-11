import { Module } from '@nestjs/common';
import { ModelVideosService } from './model-videos.service';
import { ModelVideosController } from './model-videos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { ModelCategorySchema } from '../model-category/model-category.model';
import { SpaceModule } from '../space';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.modelVideos, schema: ModelCategorySchema },
    ]),
    SpaceModule,
  ],
  controllers: [ModelVideosController],
  providers: [ModelVideosService],
})
export class ModelVideosModule {}
