import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Newsfeed } from './newsfeed.model';

export class CreateNewsfeedDto extends OmitType(Newsfeed, ['userId']) {
  userId: string;
}
export class UpdateNewsfeedDto extends PartialType(CreateNewsfeedDto) {}
