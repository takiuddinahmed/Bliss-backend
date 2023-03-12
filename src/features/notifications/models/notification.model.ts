import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserDocument } from '../../user/user.model';
import { collectionNames } from '../../common';
import { IsOptional } from 'class-validator';
import { ReceiverSchema, ReceiverDocument } from './receiver.model';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: collectionNames.user,
  })
  sender: UserDocument;

  @IsOptional()
  @Prop({
    type: [ReceiverSchema],
    required: true
  })
  receivers: ReceiverDocument[];

  @Prop()
  subject: string;

  @Prop()
  text: string;

  @Prop()
  activityType: string;

  @Prop()
  activityName: string;

  @Prop({
    type: SchemaTypes.Mixed,
  })
  actionInfo: Record<string, unknown>;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const NotificationModel = SchemaFactory.createForClass(Notification);
