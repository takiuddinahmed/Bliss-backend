import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { collectionNames } from '../../common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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

  @IsOptional()
  @ApiProperty({ enum: ['true', 'false'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  isAnonymous?: boolean;
}

export const LiveStreamChatSchema =
  SchemaFactory.createForClass(LiveStreamChat);
