import { IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReceiverDto implements Readonly<ReceiverDto> {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  userId: string;

  @ApiProperty({ default: false })
  isRead: boolean;

  @ApiProperty({ default: false })
  isDeleted: boolean;
}
