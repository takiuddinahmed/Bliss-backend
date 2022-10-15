import { PartialType } from "@nestjs/mapped-types";
import { ContentType } from "./content-type.model";

export class CreateContentTypeDto extends ContentType {}
export class UpdateContentTypeDto extends PartialType(
    CreateContentTypeDto
  ) {}