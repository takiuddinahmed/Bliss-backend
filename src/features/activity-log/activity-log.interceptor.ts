import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityLogService } from './activity-log.service';
import {
  ActivityName,
  ActivityType,
} from '../../features/common/enum/log.enum';
import { ActivityLogDTO } from './dto/activity-log.dto';

export interface Response<T> {
  status: string;
  data: T;
  message: string;
}

@Injectable()
export class ActivityLogInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private readonly logService: ActivityLogService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const route = req.route.path;
    const user = req.user;
    const logDTO = new ActivityLogDTO();
    const actionInfo: any = {
      isMigrated: false,
      payload: req.body,
      url: req.url,
      method: method,
    };
    logDTO.userId = user && user._id;
    return next.handle().pipe(
      tap((res) => {
        const result = res.hasOwnProperty('data') ? res.data : res;
        switch (route) {
          case '/user/register':
            if (method === 'POST') {
              logDTO.activityType = ActivityType.CREATED;
              logDTO.activityName = ActivityName.USER;
              logDTO.userId = result._id;
              delete actionInfo.payload.password;
            }
            break;
          case '/user/profile':
            if (method === 'GET') {
              // need to do something
            }
            break;
          case '/user':
            if (method === 'GET') {
              // need to do something
            }
            if (method === 'PATCH') {
              logDTO.activityType = ActivityType.UPDATED;
              logDTO.activityName = ActivityName.USER;
            }
            if (method === 'PUT') {
              logDTO.activityType = ActivityType.UPDATED;
              logDTO.activityName = ActivityName.USER;
            }
            if (method === 'DELETE') {
              logDTO.activityType = ActivityType.DELETED;
              logDTO.activityName = ActivityName.USER;
            }
            break;
          case '/category':
            if (method === 'GET') {
              // need to do something
            }
            if (method === 'POST') {
              logDTO.activityType = ActivityType.CREATED;
              logDTO.activityName = ActivityName.CATEGORY;
            }
            break;
          case '/category/:id':
            if (method === 'GET') {
              // need to do something
            }
            if (method === 'PATCH') {
              logDTO.activityType = ActivityType.UPDATED;
              logDTO.activityName = ActivityName.CATEGORY;
            }
            if (method === 'DELETE') {
              logDTO.activityType = ActivityType.DELETED;
              logDTO.activityName = ActivityName.CATEGORY;
            }
            break;

          case '/content':
            if (method === 'GET') {
              // need to do something
            }
            if (method === 'POST') {
              logDTO.activityType = ActivityType.CREATED;
              logDTO.activityName = ActivityName.CONTENT;
            }
            break;

          case '/content/:permalink':
            if (method === 'PATCH') {
              logDTO.activityType = ActivityType.UPDATED;
              logDTO.activityName = ActivityName.CONTENT;
            }
            if (method === 'DELETE') {
              logDTO.activityType = ActivityType.DELETED;
              logDTO.activityName = ActivityName.CONTENT;
            }
            break;
        }
        actionInfo.response = {
          status: 'SUCCESS',
          data: result || '',
          message: res.message || '',
        };
        actionInfo.time = Date.now() - now;
        logDTO.actionInfo = actionInfo;
        this.logService.create(logDTO);
      }),
    );
  }
}
