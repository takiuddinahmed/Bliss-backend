import { Module } from '@nestjs/common';
import { ResortService } from './resort.service';
import { ResortController } from './resort.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { ResortSchema } from './resort.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.Resort,
        schema: ResortSchema,
      },
    ]),
  ],
  controllers: [ResortController],
  providers: [ResortService],
})
export class ResortModule {}
