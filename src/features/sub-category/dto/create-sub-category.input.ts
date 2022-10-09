import { InputType, Int, Field } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class CreateSubCategoryInput {
  @IsString()
  @Field(() => String)
  name: string;

  @IsMongoId()
  @Field(() => String)
  categoryId: string;
}
