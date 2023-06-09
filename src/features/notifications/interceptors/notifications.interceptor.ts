import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { CreateNotificationDTO } from '../../notifications/dto';
import { ActivityName, ActivityType } from '../../common/enum/log.enum';
import { ContentCommentService } from '../../content-comment/content-comment.service';

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
    constructor(
        private readonly notificationService: NotificationsService,
        private readonly contentCommentService: ContentCommentService,
    ) { }
    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        const route = req.route.path;
        const cNotificationDTO = new CreateNotificationDTO();
        let actionInfo: any = {};
        let receivers = []
        return next.handle().pipe(
            tap(async (res) => {
                const result = res.hasOwnProperty('data') ? res.data : res;
                switch (route) {
                    case '/user/register':
                        if (method === 'POST') {
                            cNotificationDTO.activityType = ActivityType.CREATED;
                            cNotificationDTO.activityName = ActivityName.USER;
                            cNotificationDTO.receiver = result._id;
                            cNotificationDTO.subject = 'Congratulations'
                            cNotificationDTO.text = 'You are all set.'
                        }
                        break;

                    case '/content-comment':
                        if (method === 'POST') {
                            cNotificationDTO.activityType = ActivityType.CREATED;
                            cNotificationDTO.activityName = ActivityName.CONTENT_COMMENT;
                            receivers = await this.contentCommentService.findCommentedUserOfContent(result.contentId);
                            cNotificationDTO.subject = 'commented'
                            cNotificationDTO.text = 'someone is commented on a post your are following.'
                        }
                        break;

                    case '/content/:permalink':
                        if (method === 'PATCH') {
                            cNotificationDTO.activityType = ActivityType.UPDATED;
                            cNotificationDTO.activityName = ActivityName.CONTENT;
                            receivers = await this.contentCommentService.findCommentedUserOfContent(result.contentId);
                            cNotificationDTO.subject = 'Content Updated'
                            cNotificationDTO.text = 'Content is updated.'
                        }

                        if (method === 'DELETE') {
                            cNotificationDTO.activityType = ActivityType.DELETED;
                            cNotificationDTO.activityName = ActivityName.CONTENT;
                            receivers = await this.contentCommentService.findCommentedUserOfContent(result.contentId);
                            cNotificationDTO.subject = 'Content Deleted'
                            cNotificationDTO.text = 'Content is Deleted.'
                        }
                        break;
                }

                actionInfo = {
                    status: 'SUCCESS',
                    data: result || '',
                    message: res.message || '',
                };

                cNotificationDTO.actionInfo = actionInfo;

                if (receivers && Array.isArray(receivers) && receivers.length > 0) {
                    receivers.map(async (receiver) => {
                        if (receiver != result.userId) {
                            cNotificationDTO.receiver = receiver;
                            await this.notificationService.create(cNotificationDTO);
                        }
                    })
                }
                else {
                    await this.notificationService.create(cNotificationDTO);
                }

            }),
        );
    }
}
