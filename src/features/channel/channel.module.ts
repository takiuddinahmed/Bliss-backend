import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelResolver } from './channel.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelSchema } from './channel.model';
import { collectionNames } from '../common';
import { UserModule } from '../user';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.channel,
        schema: ChannelSchema,
      },
    ]),
    UserModule,
  ],
  providers: [ChannelResolver, ChannelService],
})
export class ChannelModule {}
