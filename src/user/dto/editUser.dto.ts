import { IsString, IsEnum, ValidateIf, IsEmail } from 'class-validator';
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
}
