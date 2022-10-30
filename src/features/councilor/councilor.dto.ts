import { PartialType } from '@nestjs/mapped-types';
import { Councilor } from './councilor.model';

export class CreateCouncilorDto extends Councilor {}
export class UpdateCouncilorDto extends PartialType(CreateCouncilorDto) {}
