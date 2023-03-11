import { PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { collectionNames } from '../config/collectionNames.config';
import { userPopulateSelect } from '../config/userVirtual.config';
import { PopulatedUser } from '../interface/populatedUser.interface';

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Comment {
  @Prop({
    type: Types.ObjectId,
    ref: collectionNames.user,
    autopopulate: { select: userPopulateSelect },
  })
  userId: Types.ObjectId | PopulatedUser;

  @ApiProperty()
  @IsString()
  @Prop({ type: String })
  comment: string;
}
export type CommentDocument = HydratedDocument<Comment>;
export const CommentSchema = SchemaFactory.createForClass(Comment);
export class CreateCommentDto extends Comment {}
export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
