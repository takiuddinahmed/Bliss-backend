import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { collectionNames } from '../common';
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class ModelPicture {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: collectionNames.user,
  })
  userId: Types.ObjectId | string;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  modelProfileId: Types.ObjectId | string;

  
}
