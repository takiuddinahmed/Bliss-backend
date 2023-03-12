import { Document } from 'mongoose';

export interface INotification extends Document {
  readonly _id: string;
  readonly sender: string;
  readonly receiver: string;
  readonly subject: string;
  readonly text: string;
  readonly activityType: string;
  readonly activityName: string;
  readonly actionInfo: Record<string, unknown>;
  readonly isRead: boolean;
  readonly cTime: number;
  readonly cBy: string;
  readonly uTime: number;
  readonly uBy: string;
}
