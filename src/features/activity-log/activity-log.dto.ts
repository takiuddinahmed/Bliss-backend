import { IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivityLogDTO implements Readonly<ActivityLogDTO> {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  userId: string;

  @ApiProperty()
  activityType: string;

  @ApiProperty()
  activityName: string;

  @ApiProperty()
  actionInfo: Record<string, unknown>;
}
