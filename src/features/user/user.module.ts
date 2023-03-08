import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { SpaceModule } from '../space';
import { UserController } from './user.controller';
import { UserSchema } from './user.model';
import { UserService } from './user.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityLogSchema } from '../activity-log/activity-log.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.user, schema: UserSchema },
      { name: collectionNames.activityLog, schema: ActivityLogSchema },
    ]),
    SpaceModule,
  ],
  controllers: [UserController],
  providers: [UserService, ActivityLogService],
  exports: [UserService],
})
export class UserModule {}
