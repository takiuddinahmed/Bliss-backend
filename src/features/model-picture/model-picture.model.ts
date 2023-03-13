import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { collectionNames, userPopulateSelect } from '../common';
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class ModelPicture {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: collectionNames.user,
    autopopulate: { select: userPopulateSelect },
  })
  userId: Types.ObjectId | string;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  modelProfileId: Types.ObjectId | string;
}
