import { Module } from '@nestjs/common';
import {
  LiveStreamController,
  LiveKitController,
  StreamChatController,
} from './controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { LiveStreamSchema } from './models/live-stream.model';
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
  controllers: [LiveStreamController, LiveKitController, StreamChatController],
  providers: [LiveStreamService, LiveKitService, StreamChatService],
})
export class LiveStreamModule {}
