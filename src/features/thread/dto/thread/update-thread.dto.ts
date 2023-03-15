import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateThreadDto } from './create-thread.dto';

export class UpdateThreadDto extends PartialType(CreateThreadDto) {
}
