import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ContentType } from './content-type.model';

export class CreateContentTypeDto extends ContentType {}
export class omitDto extends OmitType(CreateContentTypeDto, [
  'contentType',
] as const) {}
export class UpdateContentTypeDto extends PartialType(omitDto) {}
