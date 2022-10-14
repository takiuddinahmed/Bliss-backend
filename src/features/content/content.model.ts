import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  collectionNames,
  ContentTypeEnum,
  FileData,
  SexualityEnum,
  VisualityEnum
} from '../common';

@Schema()
export class Content extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: collectionNames.user })
  userId: Types.ObjectId;

  @Prop([
    { type: Types.ObjectId, required: true, ref: collectionNames.category },
  ])
  categoryId: Types.ObjectId;

  @Prop([
    { type: Types.ObjectId, required: true, ref: collectionNames.category },
  ])
  subCategoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: collectionNames.channel })
  channelId: Types.ObjectId;

  @Prop({
    type: String,
    enum: SexualityEnum,
    required: true,
    default: SexualityEnum.STRIGHT,
  })
  sexuality: SexualityEnum;

  @Prop({ type: String, required: true, enum: ContentTypeEnum })
  contentType: ContentTypeEnum;

  @Prop({ type: String, default: '' })
  title: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: FileData, default: '' })
  file: FileData;

  @Prop({ type: Array<FileData>, default: [] })
  thumbnail: FileData[];

  @Prop({ type: Number })
  duration: number;

  @Prop({
    type: String,
    enum: VisualityEnum,
    required: true,
    default: VisualityEnum.PRIVATE,
  })
  visualiTy: VisualityEnum;
}
const ContentSchema = SchemaFactory.createForClass(Content);

export default ContentSchema;
