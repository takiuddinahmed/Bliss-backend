import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateLiveStreamDto } from './create-live-stream.dto';
import {
    IsBoolean,
    IsOptional,
} from 'class-validator';

export class UpdateLiveStreamDto extends PartialType(CreateLiveStreamDto) {
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isEnd: boolean;
}
