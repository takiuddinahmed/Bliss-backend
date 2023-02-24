import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional } from 'class-validator';
import { FileData } from '../common';
import { Newsfeed } from './newsfeed.model';

export class CreateNewsfeedDto extends Newsfeed {}
export class UpdateNewsfeedDto extends PartialType(CreateNewsfeedDto) {
  @IsOptional()
  @IsArray()
  oldFiles?: FileData[];
}
