import { Document } from 'mongoose';
import { IParticipant } from './participant.interface';

export interface IChat extends Document {
  readonly _id: string;
  readonly threadId: string;
  readonly message: string;
  readonly sender: string;
  readonly receivers: IParticipant[]
  readonly isDelete: boolean;
}
