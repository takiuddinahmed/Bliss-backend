import { PartialType } from '@nestjs/mapped-types';
import { Newsfeed } from './newsfeed.model';

export class CreateNewsfeedDto extends Newsfeed {}
export class UpdateNewsfeedDto extends PartialType(CreateNewsfeedDto) {}
