import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { FileData } from 'src/features/common';

@InputType()
export class CreateChannelInput {
  @IsString()
  @Field(() => String)
  name: string;

  @IsString()
  @Field(() => String)
  description: string;

  permalink: string;

  logo: FileData;

  banner: FileData;
}
