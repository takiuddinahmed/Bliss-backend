import { Module } from '@nestjs/common';
import { ResortTypeService } from './resort-type.service';
import { ResortTypeController } from './resort-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { ResortTypeSchema } from './resort-type.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: collectionNames.resortType,
        schema: ResortTypeSchema,
      },
    ]),
  ],
  controllers: [ResortTypeController],
  providers: [ResortTypeService],
})
export class ResortTypeModule {}
