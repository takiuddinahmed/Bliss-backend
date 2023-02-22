import { PartialType } from '@nestjs/mapped-types';
import { NewsfeedComment } from './newsfeed-comment.model';

export class CreateNewsfeedCommentDto extends NewsfeedComment {}
export class UpdateNewsfeedCommentDto extends PartialType(
  CreateNewsfeedCommentDto,
) {}
