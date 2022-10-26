import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { FileData } from '../common';

export class OpenCloseTime {
  @Prop({ type: String })
  openTime: string;
  @Prop({ type: String })
  closeTime: string;
}

export class Restaurant {
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @IsOptional()
  @IsArray()
  @Prop({ type: [String], default: [] })
  contactNumber: string[];

  @IsOptional()
  @IsObject()
  @Prop({ type: OpenCloseTime, default: {} })
  openCloseTime: OpenCloseTime;

  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  description: string;

  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  rulesAndRegulations: string;

  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  website: string;

  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  location: string;

  @Prop({ type: [FileData], default: '' })
  photoGallery: FileData[];

  @IsOptional()
  @IsString()
  @Prop({ type: String, default: '' })
  speciality: string;

  @Prop({ type: FileData })
  logo: FileData;

  @Prop({ type: FileData })
  banner: FileData;

  @Prop({ type: String })
  permalink: string;
}

export type RestaurantDocument = Restaurant & Document;

export const restaurantSchema = SchemaFactory.createForClass(Restaurant);

export interface RestaurantFiles {
  logo: Express.Multer.File[];
  banner: Express.Multer.File[];
  photoGallery: Express.Multer.File[];
}
