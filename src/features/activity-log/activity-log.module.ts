import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogSchema } from './activity-log.model';
import { collectionNames } from '../common';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: collectionNames.activityLog, schema: ActivityLogSchema },
        ]),
    ],
    providers: [ActivityLogService],
})
export class ActivityLogModule { }
