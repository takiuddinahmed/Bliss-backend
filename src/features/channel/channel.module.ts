import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { UserModule } from '../user';
import { ChannelSchema } from './channel.model';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { SpaceModule } from '../space';

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
