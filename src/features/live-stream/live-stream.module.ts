import { Module } from '@nestjs/common';
import { LiveStreamService } from './live-stream.service';
import { LiveStreamController } from './live-stream.controller';

@Module({
  controllers: [LiveStreamController],
  providers: [LiveStreamService]
})
export class LiveStreamModule {}
