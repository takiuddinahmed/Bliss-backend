import { PartialType } from '@nestjs/mapped-types';
import { FileData } from '../common';
import { Newsfeed } from './newsfeed.model';

export class CreateNewsfeedDto extends Newsfeed {}
export class UpdateNewsfeedDto extends PartialType(CreateNewsfeedDto) {
  oldFiles?: FileData[];
}
