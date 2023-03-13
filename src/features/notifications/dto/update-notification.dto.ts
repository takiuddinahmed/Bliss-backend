import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class UpdateNotificationDTO implements Readonly<UpdateNotificationDTO> {
  @ApiProperty()
  @IsMongoId()
  id: string;
}
