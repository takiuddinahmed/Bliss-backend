import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { SpaceModule } from '../space';
import { UserController } from './user.controller';
import { UserSchema } from './user.model';
import { UserService } from './user.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityLogSchema } from '../activity-log/activity-log.model';
import { NotificationSchema } from '../notifications/models/notification.model';
import { NotificationsService } from '../notifications/services/notifications.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.user, schema: UserSchema },
      { name: collectionNames.activityLog, schema: ActivityLogSchema },
      { name: collectionNames.notification, schema: NotificationSchema },
    ]),
    SpaceModule,
  ],
  controllers: [UserController],
  providers: [UserService, ActivityLogService, NotificationsService],
  exports: [UserService],
})
export class UserModule { }
