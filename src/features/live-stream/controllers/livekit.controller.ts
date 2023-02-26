import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { LiveKitService } from '../services';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRoomDto, CreateTokenDto } from '../dto';
import { AuthUser } from '../../security/get-user.decorator';

@ApiTags('LiveStream')
// @ApiBearerAuth()
@Controller('livestream/livekit')
export class LiveKitController {
  constructor(private readonly liveKitService: LiveKitService) { }

  @Post('token/create')
  createToken(@AuthUser() user, @Body() createTokenDto: CreateTokenDto) {
    try {
      return this.liveKitService.createToken(createTokenDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get('rooms')
  getRooms() {
    try {
      return this.liveKitService.listRoom();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post('rooms')
  createRoom(@AuthUser() user, @Body() createRoomDto: CreateRoomDto) {
    try {
      return this.liveKitService.createRoom(createRoomDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('rooms/:room')
  deleteRoom(@Param('room') room: string) {
    try {
      return this.liveKitService.deleteRoom(room);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
