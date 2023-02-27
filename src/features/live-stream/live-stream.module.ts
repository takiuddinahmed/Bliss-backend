import { Module } from '@nestjs/common';
import { LiveStreamController } from './controllers/live-stream.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { LiveStreamSchema } from './models/live-stream.model';
import { LiveKitController } from './controllers/livekit.controller';
import {
  LiveStreamService,
  LiveKitService,
  StreamChatService,
} from './services';
import { LiveStreamChatSchema } from './models/streaming-chat.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.livestream,
        schema: LiveStreamSchema,
      },
      {
        name: collectionNames.streamingChat,
        schema: LiveStreamChatSchema,
      },
    ]),
  ],
  controllers: [LiveStreamController, LiveKitController],
  providers: [LiveStreamService, LiveKitService, StreamChatService],
})
export class LiveStreamModule {}
