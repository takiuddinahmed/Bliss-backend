import { PartialType } from '@nestjs/mapped-types';
import { Resort } from './resort.model';

export class CreateResortDto extends Resort {}
export class UpdateResortDto extends PartialType(Resort) {}
