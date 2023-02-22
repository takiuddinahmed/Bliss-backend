import { Module } from '@nestjs/common';
import { LiveStreamController } from './controllers/live-stream.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { LiveStreamSchema } from './models/live-stream.model';
import { LiveKitController } from './controllers/livekit.controller';
import { LiveStreamService, LiveKitService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.livestream,
        schema: LiveStreamSchema,
      },
    ]),
  ],
  controllers: [LiveStreamController, LiveKitController],
  providers: [LiveStreamService, LiveKitService],
})
export class LiveStreamModule {}
