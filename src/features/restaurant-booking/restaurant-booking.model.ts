import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator';
import { RestaurantBookingType } from './restaurant-booking-type.enum';
import { collectionNames } from '../common';

@Schema({ timestamps: true })
export class RestaurantBooking {
  @ApiProperty({ type: 'mongoId' })
  @IsMongoId()
  @Prop({ type: Types.ObjectId, ref: collectionNames.restaurant })
  restaurantId: Types.ObjectId | string;

  @Prop({ type: Types.ObjectId, ref: collectionNames.user })
  userId: Types.ObjectId | string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @IsNumber()
  @Prop({ type: Number })
  memberCount: number;

  @ApiProperty()
  @IsString()
  @Prop({ type: String })
  phoneNumber: string;

  @ApiProperty({ enum: RestaurantBookingType })
  @IsEnum(RestaurantBookingType)
  @Prop({ type: String, enum: RestaurantBookingType, required: true })
  bookingType: RestaurantBookingType;

  @ApiProperty()
  @IsDateString()
  @Prop({ type: Date })
  dateTime: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String })
  details: string;

  @Prop({ type: Boolean, default: false })
  accepted: boolean;
}
export type RestaurantBookingDocument = RestaurantBooking & Document;
export type RestaurantBookingDocumentWithId = RestaurantBookingDocument & {
  _id: Types.ObjectId;
};

export const RestaurantBookingSchema =
  SchemaFactory.createForClass(RestaurantBooking);
