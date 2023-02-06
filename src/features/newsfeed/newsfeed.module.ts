import { Module } from '@nestjs/common';
import { NewsfeedService } from './newsfeed.service';
import { NewsfeedController } from './newsfeed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { NewsfeedSchema } from './newsfeed.model';
import { SpaceModule } from '../space';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.newsfeed,
        schema: NewsfeedSchema,
      },
    ]),
    SpaceModule,
  ],
  controllers: [NewsfeedController],
  providers: [NewsfeedService],
})
export class NewsfeedModule {}
