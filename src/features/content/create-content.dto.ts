import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { FileUpload } from 'graphql-upload';
import { Types } from 'mongoose';
import { ContentTypeEnum, SexualityEnum, VisualityEnum } from '../common';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class CreateContentDto {
  @IsMongoId()
  @Field(() => ID)
  categoryId: Types.ObjectId;

  // TODO: remove after authoriztion
  @IsMongoId()
  @Field(() => ID)
  userId: Types.ObjectId;

  @IsEnum(SexualityEnum)
  @Field(() => String)
  sexuality: SexualityEnum;

  @IsString()
  @Field(() => String)
  title: string;

  @IsString()
  @Field(() => String)
  description: string;

  @IsEnum(VisualityEnum)
  @Field(() => String)
  visualiTy: VisualityEnum;

  @IsEnum(ContentTypeEnum)
  @Field(() => String)
  contentType: ContentTypeEnum;

  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true })
  file: Promise<FileUpload>;

  fileUrl?: string;
}
