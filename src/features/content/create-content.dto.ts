import { InputType } from '@nestjs/graphql';
import { Content } from './content.model';

@InputType()
export class CreateContentDto extends Content {}
