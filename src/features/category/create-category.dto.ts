import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { SexualityEnum } from '../common';

@InputType()
export class CreateCategoryDto {
  @IsString()
  @Field(() => String)
  name: string;
}
