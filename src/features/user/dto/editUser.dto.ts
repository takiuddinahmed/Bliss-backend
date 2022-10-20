import {
  IsString,
  IsEnum,
  ValidateIf,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { FileData } from 'src/features/common';
import { ROLE } from '../user.model';

export class EditUserDto {
  @IsString()
  @ValidateIf((obj, value) => value != null)
  firstName: string;

  @IsString()
  @ValidateIf((obj, value) => value != null)
  lastName: string;

  @IsString()
  @IsEmail()
  @ValidateIf((obj, value) => value != null)
  email: string;

  @IsString()
  @ValidateIf((obj, value) => value != null)
  phoneNumber: string;

  @IsEnum(ROLE)
  @ValidateIf((obj, value) => value != null)
  role: ROLE;

  @IsOptional()
  @IsString()
  address: string;

  proPic: FileData;
}
