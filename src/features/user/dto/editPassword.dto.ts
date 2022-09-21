import { IsString, MinLength } from 'class-validator';

export class EditPassDto {
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @IsString()
  @MinLength(6)
  oldPassword: string;
}
