import { Module } from '@nestjs/common';
import { ResortService } from './resort.service';
import { ResortController } from './resort.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { default as ResortSchema } from './resort.model';
import { SpaceModule } from '../space';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.resort,
        schema: ResortSchema,
      },
    ]),
    SpaceModule,
  ],
  controllers: [ResortController],
  providers: [ResortService],
})
export class ResortModule {}
