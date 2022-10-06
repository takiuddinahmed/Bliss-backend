import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelResolver } from './channel.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from './channel.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Channel.name,
        schema: ChannelSchema,
      },
    ]),
  ],
  providers: [ChannelResolver, ChannelService],
})
export class ChannelModule {}
