import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SexualityEnum } from '../common';

@InputType()
export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name: string;
}
