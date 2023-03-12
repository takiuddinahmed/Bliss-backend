import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, ValidateNested } from 'class-validator';
import { ReceiverDto } from './receiver.dto';
import { Type } from 'class-transformer';
import { Receiver } from '../models/receiver.model';

export class UpdateNotificationDTO implements Readonly<UpdateNotificationDTO> {
  @ApiProperty()
  @IsMongoId()
  id: string;

  @ApiProperty({
    type: [ReceiverDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiverDto)
  receivers: [Receiver];
}
