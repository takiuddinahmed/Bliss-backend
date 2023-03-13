import {
  IsString,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationDTO implements Readonly<NotificationDTO> {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  sender: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  receiver: string;

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
