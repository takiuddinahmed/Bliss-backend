import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../category';
import {
  collectionNames,
  ContentTypeEnum,
  SexualityEnum,
  VisualityEnum,
} from '../common';
import { ContentType } from '../content-type';
import { User } from '../user';

@Schema({
  virtuals: [{}],
})
@ObjectType({ description: 'content' })
export class Content extends Document {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, required: true, ref: collectionNames.user })
  userId: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, required: true, ref: collectionNames.category })
  categoryId: Types.ObjectId;

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

  @Field(() => String)
  @Prop({ type: String, default: '' })
  fileUrl: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String], default: [] })
  thumbnailUrl: string[];

  @Field(() => String)
  @Prop({
    type: String,
    enum: VisualityEnum,
    required: true,
    default: VisualityEnum.PRIVATE,
  })
  visualiTy: VisualityEnum;

  @Field(() => User, { nullable: true })
  user: User;
}
const ContentSchema = SchemaFactory.createForClass(Content);

ContentSchema.virtual('user', {
  ref: collectionNames.user,
  localField: 'userId',
  foreignField: '_id',
});

export default ContentSchema;
