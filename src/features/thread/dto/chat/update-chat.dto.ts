import { ArrayMinSize, IsArray, IsMongoId, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Participant } from '../../models/participant.model';
import { ParticipantDTO } from '../participant.dto';
import { Type } from 'class-transformer';

export class UpdateChatDto implements Readonly<UpdateChatDto> {
  @ApiProperty()
  @IsString()
  message: string;
}

