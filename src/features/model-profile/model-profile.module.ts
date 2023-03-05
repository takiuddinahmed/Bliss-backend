import { Module } from '@nestjs/common';
import { ModelProfileService } from './model-profile.service';
import { ModelProfileController } from './model-profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { ModelProfileSchema } from './model-profile.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.modelProfile,
        schema: ModelProfileSchema,
      },
    ]),
  ],
  controllers: [ModelProfileController],
  providers: [ModelProfileService],
})
export class ModelProfileModule {}
