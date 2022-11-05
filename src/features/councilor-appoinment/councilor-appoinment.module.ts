import { Module } from '@nestjs/common';
import { CouncilorAppoinmentService } from './councilor-appoinment.service';
import { CouncilorAppoinmentController } from './councilor-appoinment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { CouncilorAppoinmentSchema } from './councilor-appoinment.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.councilorAppoinment,
        schema: CouncilorAppoinmentSchema,
      },
    ]),
  ],
  controllers: [CouncilorAppoinmentController],
  providers: [CouncilorAppoinmentService],
})
export class CouncilorAppoinmentModule {}
