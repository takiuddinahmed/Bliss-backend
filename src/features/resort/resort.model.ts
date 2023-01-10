import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Resort {}

export type ResortDocument = Resort & Document;
export type ResortDocumentWithId = ResortDocument & {
  _id: Types.ObjectId;
};

export const ResortSchema = SchemaFactory.createForClass(Resort);
