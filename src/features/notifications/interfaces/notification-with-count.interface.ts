import { INotification } from './notification.interface';

export interface INotificationWithCount {
  readonly notifications: INotification[];
  readonly unreadCount: number;
}
