import { ArrayMinSize, IsArray, IsMongoId, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Participant } from '../../models/participant.model';
import { ParticipantDTO } from '../participant.dto';
import { Type } from 'class-transformer';

export class CreateChatDto implements Readonly<CreateChatDto> {
  @ApiProperty()
  @IsMongoId()
  threadId: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsMongoId()
  sender: string;

  @ApiProperty({
    type: [ParticipantDTO],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ParticipantDTO)
  receivers: [Participant];
}

