import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

function ToBoolean() {
  return Transform((v) => ['1', 1, 'true', true].includes(v.value));
}
export class SearchNotificationDto implements Readonly<SearchNotificationDto> {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip: number;

  @ApiProperty({
    required: false,
  })
  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  getAllRecord: boolean;

  @ApiProperty({
    required: false,
  })
  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  noCondition: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  select: string[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  filter: any;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  sort: any;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  pagination: boolean;
}
