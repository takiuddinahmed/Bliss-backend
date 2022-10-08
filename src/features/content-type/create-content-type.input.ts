import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { ContentTypeEnum } from '../common';

@InputType()
export class CreateContentTypeInput {
  @IsString()
  @Field(() => String)
  name: string;

  @IsString()
  @Field(() => String)
  icon: string;

  @IsEnum(ContentTypeEnum)
  @Field(() => String)
  contentType: ContentTypeEnum;
}
