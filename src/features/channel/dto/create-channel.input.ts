import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';
import { FileData } from 'src/features/common';

@InputType()
export class CreateChannelInput {
  @IsString()
  @Field(() => String)
  name: string;

  @IsMongoId()
  @Field(() => ID)
  userId: string;

  @IsString()
  @Field(() => String)
  description: string;

  permalink: string;

  logo: FileData;

  banner: FileData;
}
