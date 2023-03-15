import { Document } from 'mongoose';
import { IParticipant } from './participant.interface';

export interface IThread extends Document {
  readonly _id: string;
  readonly participants: IParticipant[];
  readonly isGroup: boolean;
}
