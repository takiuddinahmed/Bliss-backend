import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateStreamChatDto implements Readonly<CreateStreamChatDto> {
  @ApiProperty()
  @IsMongoId()
  streamId: Types.ObjectId | string;

  @ApiProperty()
  @IsMongoId()
  sender: Types.ObjectId | string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isAnonymous: boolean;
}
