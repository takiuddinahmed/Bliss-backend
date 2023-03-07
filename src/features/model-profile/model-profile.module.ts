import { Module } from '@nestjs/common';
import { ModelProfileService } from './model-profile.service';
import { ModelProfileController } from './model-profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { ModelProfileSchema } from './model-profile.model';
import { SpaceModule } from '../space';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.modelProfile,
        schema: ModelProfileSchema,
      },
    ]),
    SpaceModule,
  ],
  controllers: [ModelProfileController],
  providers: [ModelProfileService],
})
export class ModelProfileModule {}
