import { IsString, IsMongoId, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDTO implements Readonly<CreateNotificationDTO> {
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
  actionInfo: any;
}

export class CreateNotificationDto {}
