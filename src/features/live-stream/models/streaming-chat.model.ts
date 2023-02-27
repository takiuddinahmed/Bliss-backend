import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { collectionNames } from '../../common';

export type LiveStreamChatDocument = LiveStreamChat & Document;

@Schema({ timestamps: true })
export class LiveStreamChat {
  @IsMongoId()
  @Prop({
    type: Types.ObjectId,
    ref: collectionNames.livestream,
    required: true,
  })
  streamId: Types.ObjectId | string; // here stream id will act as room in the chat

  @IsMongoId()
  @Prop({
    type: Types.ObjectId,
    ref: collectionNames.user,
    required: true,
  })
  sender: Types.ObjectId | string;

  @IsString()
  @Prop({ type: String, required: true })
  message: string;
}

export const LiveStreamChatSchema =
  SchemaFactory.createForClass(LiveStreamChat);
