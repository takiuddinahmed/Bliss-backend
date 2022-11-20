import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsString } from 'class-validator';
import { collectionNames, FileData, FileDataSchema } from '../common';

@Schema({ timestamps: true })
export class RestaurantCategory {
  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: string | Types.ObjectId;

  @ApiProperty()
  @IsString()
  @Prop({ type: String })
  name: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'File' })
  @Prop({ type: FileDataSchema, default: {} })
  image?: FileData;

  @Prop({ type: String })
  permalink: string;
}

export type RestaurantCategoryDocument = RestaurantCategory & Document;
export const RestaurantCategorySchema =
  SchemaFactory.createForClass(RestaurantCategory);
