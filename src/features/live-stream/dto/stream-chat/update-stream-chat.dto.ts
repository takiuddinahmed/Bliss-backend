import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
} from 'class-validator';



export class UpdateStreamChatDto implements Readonly<UpdateStreamChatDto> {
    @ApiProperty()
    @IsString()
    message: string;
}
