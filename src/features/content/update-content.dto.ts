import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { FileUpload } from 'graphql-upload';
import { Types } from 'mongoose';
import { ContentTypeEnum, SexualityEnum, VisualityEnum } from '../common';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class UpdateContentDto {
  @IsOptional()
  @IsMongoId()
  @Field(() => ID)
  categoryId: Types.ObjectId;

  @IsOptional()
  @IsEnum(SexualityEnum)
  @Field(() => String)
  sexuality: SexualityEnum;

  @IsOptional()
  @IsString()
  @Field(() => String)
  title: string;

  @IsOptional()
  @IsString()
  @Field(() => String)
  description: string;

  @IsOptional()
  @IsEnum(VisualityEnum)
  @Field(() => String)
  visualiTy: VisualityEnum;

  @IsOptional()
  @IsEnum(ContentTypeEnum)
  @Field(() => String)
  contentType: ContentTypeEnum;

  @IsOptional()
  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true })
  file: Promise<FileUpload>;

  fileUrl?: string;
}
