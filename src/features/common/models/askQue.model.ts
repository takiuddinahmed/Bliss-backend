import { PickType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';
import { collectionNames } from '../config/collectionNames.config';
import { userPopulateSelect } from '../config/userVirtual.config';
import { PopulatedUser } from '../interface/populatedUser.interface';

@Schema({ timestamps: true })
export class AskQueAns {
  @Prop({
    type: Types.ObjectId,
    ref: collectionNames.user,
    autopopulate: userPopulateSelect,
  })
  userId: Types.ObjectId | PopulatedUser;

  @IsString()
  @Prop({ type: String })
  question: string;

  @IsString()
  @Prop({ type: String })
  answer: string;
}

export type AskQueAnsDocument = AskQueAns & Document;
export const AskQueAnsSchema = SchemaFactory.createForClass(AskQueAns);

// export class CreateAskQue extends PickType(AskQueAns, ['userId', 'question']) {}
export class CreateAskQue {
  userId: string;
  @IsString()
  question: string;
}
export class AnsQue extends PickType(AskQueAns, ['answer']) {}
