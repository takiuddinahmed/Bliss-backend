import { InputType, PartialType } from '@nestjs/graphql';
import { CreateContentDto } from './create-content.dto';

@InputType()
export class UpdateContentDto extends PartialType(CreateContentDto) {}
