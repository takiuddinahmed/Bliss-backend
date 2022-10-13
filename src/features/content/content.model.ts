import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  collectionNames,
  ContentTypeEnum,
  FileData,
  SexualityEnum,
  VisualityEnum,
} from '../common';

@Schema()
@ObjectType({ description: 'content' })
export class Content extends Document {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, required: true, ref: collectionNames.user })
  userId: Types.ObjectId;

  @Field(() => ID)
  @Prop([
    { type: Types.ObjectId, required: true, ref: collectionNames.category },
  ])
  categoryId: Types.ObjectId;

  @Field(() => ID)
  @Prop([
    { type: Types.ObjectId, required: true, ref: collectionNames.category },
  ])
  subCategoryId: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, required: true, ref: collectionNames.channel })
  channelId: Types.ObjectId;

  @Prop({
    type: String,
    enum: SexualityEnum,
    required: true,
    default: SexualityEnum.STRIGHT,
  })
  @Field(() => String)
  sexuality: SexualityEnum;

  @Field(() => String)
  @Prop({ type: String, required: true, enum: ContentTypeEnum })
  contentType: ContentTypeEnum;

  @Field(() => String)
  @Prop({ type: String, default: '' })
  title: string;

  @Field(() => String)
  @Prop({ type: String, default: '' })
  description: string;

  @Field(() => FileData, { nullable: true })
  @Prop({ type: FileData, default: '' })
  file: string;

  @Field(() => [FileData], { nullable: true })
  @Prop({ type: [FileData], default: [] })
  thumbnail: FileData[];

  @Field(() => String)
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
