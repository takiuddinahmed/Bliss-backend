import { PartialType } from '@nestjs/swagger';
import { CreateLiveStreamDto } from './create-live-stream.dto';

export class UpdateLiveStreamDto extends PartialType(CreateLiveStreamDto) {}
