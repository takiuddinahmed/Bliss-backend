import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParticipantDTO implements Readonly<ParticipantDTO> {
  @ApiProperty()
  @IsMongoId()
  userId: string;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  isOnline: boolean;

  @ApiProperty()
  isDeleted: boolean;
}

