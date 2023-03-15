import { IThread } from './thread.interface';

export interface IThreadsWithCount {
    readonly threads: IThread[];
    readonly receiverUnreadCount: number;
}
