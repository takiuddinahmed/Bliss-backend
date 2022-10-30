import { CouncilorService } from './councilor.service';
import { CouncilorController } from './councilor.controller';
import { CouncilorSchema } from './councilor.model';
import { Module } from '@nestjs/common';
import { collectionNames } from '../common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceModule } from '../space';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.councilor, schema: CouncilorSchema },
    ]),
    SpaceModule,
  ],
  controllers: [CouncilorController],
  providers: [CouncilorService],
})
export class CouncilorModule {}
