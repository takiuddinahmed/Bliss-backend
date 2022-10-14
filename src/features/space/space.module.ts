import { Module } from '@nestjs/common';
import { SpaceProviderService } from './space-provider.service';
import { SpaceService } from './space.service';

@Module({
  providers: [SpaceService],
  exports: [SpaceService],
})
export class SpaceModule {}
