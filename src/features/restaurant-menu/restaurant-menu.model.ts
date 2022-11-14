import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { collectionNames, FileData, FileDataSchema } from 'src/features/common';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

@Schema({ timestamps: true })
export class RestaurantMenu {
  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: Types.ObjectId;

  @ApiProperty({ type: 'Mongo Id' })
  @IsMongoId()
  @Prop({ type: Types.ObjectId, ref: collectionNames.restaurant })
  restaurantId: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  quantity: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  price: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty({ type: 'File' })
  @Prop({ type: FileDataSchema })
  image: FileData;

  @ApiProperty({ type: 'array', items: { type: 'File' }, default: [] })
  @Prop({ type: [FileDataSchema], default: [] })
  videos: FileData[];

  @ApiProperty({ type: 'array', items: { type: 'File' }, default: [] })
  @Prop({ type: [FileDataSchema], default: [] })
  thumnails: FileData[];
  permalink: string;
}

export type RestaurantMenuDocument = RestaurantMenu & Document;
export const RestaurantMenuSchema =
  SchemaFactory.createForClass(RestaurantMenu);

export interface RestaurantMenuFiles {
  image: Express.Multer.File[];
  videos: Express.Multer.File[];
  thumnails: Express.Multer.File[];
}
