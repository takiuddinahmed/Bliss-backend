import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { ContentCommnetSchema } from '../content-comment/content-comment.model';
import { ContentCommentService } from '../content-comment/content-comment.service';
import { NotificationSchema } from '../notifications/models/notification.model';
import { NotificationsService } from '../notifications/services/notifications.service';
import { SpaceModule } from '../space';
import { ContentController } from './content.controller';
import ContentSchema from './content.model';
import { ContentService } from './content.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.content, schema: ContentSchema },
      { name: collectionNames.contentComment, schema: ContentCommnetSchema },
      { name: collectionNames.notification, schema: NotificationSchema },
    ]),
    SpaceModule,
  ],
  providers: [ContentService, NotificationsService, ContentCommentService],
  controllers: [ContentController],
})
export class ContentModule { }
