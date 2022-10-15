import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { SpaceModule } from '../space';
import { UserModule } from '../user';
import { ChannelController } from './channel.controller';
import { ChannelSchema } from './channel.model';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.channel,
        schema: ChannelSchema,
      },
    ]),
    UserModule,
    SpaceModule,
  ],
  providers: [ChannelService],
  controllers: [ChannelController],
})
export class ChannelModule {}
