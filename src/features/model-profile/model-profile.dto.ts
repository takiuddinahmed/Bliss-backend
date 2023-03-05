import { PartialType } from '@nestjs/mapped-types';
import { ModelProfile } from './model-profile.model';

export class CreateModelProfileDto extends ModelProfile {}
export class UpdateModelProfileDto extends PartialType(CreateModelProfileDto) {}
