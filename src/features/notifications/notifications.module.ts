import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './models/notification.model';
import { NotificationController } from './controllers/notifications.controller';
import { collectionNames } from '../common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.notification, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
