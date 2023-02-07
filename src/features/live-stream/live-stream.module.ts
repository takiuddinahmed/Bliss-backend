import { Module } from '@nestjs/common';
import { LiveStreamService } from './live-stream.service';
import { LiveStreamController } from './live-stream.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { LiveStreamSchema } from './live-stream.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.livestream,
        schema: LiveStreamSchema,
      },
    ]),
  ],
  controllers: [LiveStreamController],
  providers: [LiveStreamService],
})
export class LiveStreamModule {}
