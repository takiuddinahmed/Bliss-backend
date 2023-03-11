import { PartialType } from '@nestjs/mapped-types';
import { ModelProfile } from '../model-profile/model-profile.model';

export class CreateModelPictureDto extends ModelProfile {}
export class UpdateModelPictureDto extends PartialType(CreateModelPictureDto) {}
