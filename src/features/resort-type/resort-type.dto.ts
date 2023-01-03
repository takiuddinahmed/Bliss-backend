import { PartialType } from '@nestjs/mapped-types';
import { ResortType } from './resort-type.model';

export class CreateResortTypeDto extends ResortType {}
export class UpdateResortTypeDto extends PartialType(ResortType) {}
