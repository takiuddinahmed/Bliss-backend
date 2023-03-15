import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Participant } from '../../models/participant.model';
import { ParticipantDTO } from '../participant.dto';
import { Type } from 'class-transformer';

export class CreateThreadDto implements Readonly<CreateThreadDto> {
  @ApiProperty()
  isGroup: boolean;

  @ApiProperty({
    type: [ParticipantDTO],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => ParticipantDTO)
  participants: [Participant];
}

