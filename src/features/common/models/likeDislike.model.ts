import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { collectionNames } from '../config/collectionNames.config';
import { LikeDislikeEnum } from '../enum/likeDislike.enum';

@Schema()
export class LikeDislike {
  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: LikeDislikeEnum })
  likeDislike: LikeDislikeEnum;
}

export type LikeDislikeDocument = LikeDislike & Document;
export const LikeDislikeSchema = SchemaFactory.createForClass(LikeDislike);
