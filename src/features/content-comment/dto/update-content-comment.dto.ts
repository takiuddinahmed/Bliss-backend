import { PartialType } from '@nestjs/mapped-types';
import { CreateContentCommentDto } from './create-content-comment.dto';

export class UpdateContentCommentDto extends PartialType(CreateContentCommentDto) {}
