import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, default: ROLE.USER })
  role: ROLE;
}

export const UserSchema = SchemaFactory.createForClass(User);
