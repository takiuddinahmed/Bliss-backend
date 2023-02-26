import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTokenDto implements Readonly<CreateTokenDto> {
  @ApiProperty()
  @IsString()
  roomName: string;

  @ApiProperty()
  @IsString()
  participant: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  canPublish: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  canPublishData: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  canSubscribe: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  hidden: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  recorder: boolean;
}
