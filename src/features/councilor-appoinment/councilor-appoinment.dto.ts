import { PartialType } from '@nestjs/mapped-types';
import { CouncilorAppoinment } from './councilor-appoinment.model';

export class CreateCouncilorAppoinmentDto extends CouncilorAppoinment {}
export class UpdateCouncilorAppoinmentDto extends PartialType(
  CreateCouncilorAppoinmentDto,
) {}
