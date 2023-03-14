import { Module } from '@nestjs/common';
import { ContentCommentService } from './content-comment.service';
import { ContentCommentController } from './content-comment.controller';
import { collectionNames } from '../common';
import { ContentCommnetSchema } from './content-comment.model';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceModule } from '../space';
import { NotificationsService } from '../notifications/services/notifications.service';
import { NotificationSchema } from '../notifications/models/notification.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.contentComment, schema: ContentCommnetSchema },
      { name: collectionNames.notification, schema: NotificationSchema },
    ]),
    SpaceModule,
  ],
  controllers: [ContentCommentController],
  providers: [ContentCommentService, NotificationsService],
})
export class ContentCommentModule { }
