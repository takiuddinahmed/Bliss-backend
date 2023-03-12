import {
  IsString,
  IsMongoId,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReceiverDto } from './receiver.dto';
import { Type } from 'class-transformer';
import { Receiver } from '../models/receiver.model';

export class NotificationDTO implements Readonly<NotificationDTO> {
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
  actionInfo: Record<string, unknown>;

  @ApiProperty({ default: false })
  isRead: boolean;

  @ApiProperty({ default: false })
  isDeleted: boolean;
}
