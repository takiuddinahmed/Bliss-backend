import { Document } from 'mongoose';

export interface IParticipant extends Document {
  readonly _id: string;
  readonly userId: string;
  readonly isRead: boolean;
  readonly isOnline: boolean;
  readonly isDeleted: boolean;
}
