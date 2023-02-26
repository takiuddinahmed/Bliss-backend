import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoomDto implements Readonly<CreateRoomDto> {
  @ApiProperty()
  @IsString()
  roomName: string;
}
