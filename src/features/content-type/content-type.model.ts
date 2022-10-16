import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsString } from 'class-validator';
import { ContentTypeEnum } from '../common';

export type ContentTypeDocument = ContentType & Document;

@Schema({ timestamps: true })
export class ContentType {
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @IsString()
  @Prop({ type: String, required: true })
  icon: string;

  @IsEnum(ContentTypeEnum)
  @Prop({ type: String, enum: ContentTypeEnum, required: true })
  contentType: ContentTypeEnum;
}

export const ContentTypeSchema = SchemaFactory.createForClass(ContentType);
