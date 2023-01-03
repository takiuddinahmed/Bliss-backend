import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class ResortType {
  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true, unique: true })
  permalink: string;
}

export type ResortTypeDocument = ResortType & Document;
export type ResortTypeDocumentWithId = ResortTypeDocument & {
  _id: Types.ObjectId;
};

export const ResortTypeSchema = SchemaFactory.createForClass(ResortType);
