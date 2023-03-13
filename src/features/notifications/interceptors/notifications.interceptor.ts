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

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
    constructor(
        private readonly notificationService: NotificationsService,
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

        return next.handle().pipe(
            tap(async (res) => {
                const result = res.hasOwnProperty('data') ? res.data : res;
                switch (route) {
                    case '/user/register':
                        if (method === 'POST') {
                            cNotificationDTO.activityType = ActivityType.CREATED;
                            cNotificationDTO.activityName = ActivityName.USER;
                            cNotificationDTO.receiver = result._id;
                        }
                        break;
                }

                actionInfo = {
                    status: 'SUCCESS',
                    data: result || '',
                    message: res.message || '',
                };

                cNotificationDTO.actionInfo = actionInfo;

                await this.notificationService.create(cNotificationDTO);
            }),
        );
    }
}
