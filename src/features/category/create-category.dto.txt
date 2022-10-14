import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateCategoryDto {
  @IsString()
  @Field(() => String)
  name: string;
  permalink: string;
}
