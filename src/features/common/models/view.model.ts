import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { collectionNames } from '../config/collectionNames.config';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class View {
  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: Types.ObjectId | string;
  @Prop({ type: Number, default: 0 })
  viewCount: number;
}
export type ViewDocument = View & Document;
export const ViewSchema = SchemaFactory.createForClass(View);
