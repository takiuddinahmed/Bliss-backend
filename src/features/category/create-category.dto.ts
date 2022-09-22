import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { SexualityEnum } from '../common';

@InputType()
export class CreateCategoryDto {
  @IsString()
  @Field((type) => String)
  name: string;

  @IsEnum(SexualityEnum)
  @Field((type) => String)
  sexuality: SexualityEnum;
}
