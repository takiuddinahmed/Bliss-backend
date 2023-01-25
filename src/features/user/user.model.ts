import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { collectionNames } from '../common';

export enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  firstName: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @Prop({ type: String, required: true })
  password: string;

  @IsEnum(ROLE)
  @ValidateIf((obj, value) => value != null)
  @ApiProperty()
  @Prop({ type: String, default: ROLE.USER })
  role?: ROLE;

  @ApiProperty()
  @IsString()
  @Prop({ type: String })
  country?: string;

  @Prop({ type: Types.ObjectId, ref: collectionNames.channel })
  channelId: string | Types.ObjectId;

  @Prop({ type: String })
  proPic: string;

  @Prop({ type: String })
  address: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
