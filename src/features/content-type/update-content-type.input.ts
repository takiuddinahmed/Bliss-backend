import { InputType, PartialType } from '@nestjs/graphql';
import { CreateContentTypeInput } from './create-content-type.input';

@InputType()
export class UpdateContentTypeInput extends PartialType(
  CreateContentTypeInput,
) {}
