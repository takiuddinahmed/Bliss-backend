import { IsString, IsMongoId, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReceiverDto } from './receiver.dto';
import { Type } from 'class-transformer';
import { Receiver } from '../models/receiver.model';

export class CreateNotificationDTO implements Readonly<CreateNotificationDTO> {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  sender: string;

  @ApiProperty({
    type: [ReceiverDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiverDto)
  receivers: [Receiver];

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  activityType: string;

  @ApiProperty()
  activityName: string;

  @ApiProperty()
  actionInfo: any;
}

export class CreateNotificationDto {}
