import { PartialType } from '@nestjs/mapped-types';
import { ContentComment } from './content-comment.model';

export class CreateContentCommentDto extends ContentComment {}
export class UpdateContnetCommentDto extends PartialType(
  CreateContentCommentDto,
) {}
