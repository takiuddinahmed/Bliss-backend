import { IsString, MinLength, IsEnum, ValidateIf } from 'class-validator';
import { ROLE } from '../user.model';

export class RegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @IsEnum(ROLE)
  @ValidateIf((obj, value) => value != null)
  role: ROLE;
}
