import { PartialType } from '@nestjs/mapped-types';
import { ModelVideo } from './model-video.model';

export class CreateModelVideoDto extends ModelVideo {}
export class UpdateModelVideoDto extends PartialType(CreateModelVideoDto) {}
