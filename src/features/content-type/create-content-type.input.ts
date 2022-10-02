import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateContentTypeInput {
  @IsString()
  @Field(() => String)
  name: string;

  @IsString()
  @Field(() => String)
  icon: string;
}
