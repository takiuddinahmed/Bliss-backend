import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoomDto implements Readonly<CreateRoomDto> {
  @ApiProperty()
  @IsString()
  roomName: string;

  @ApiProperty()
  @IsString()
  participant: string;
}
