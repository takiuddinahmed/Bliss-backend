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
import { CreateRoomDto } from '../dto';
import { AuthUser } from '../../security/get-user.decorator';

@ApiTags('LiveStream')
// @ApiBearerAuth()
@Controller('livestream')
export class LiveKitController {
  constructor(private readonly liveKitService: LiveKitService) {}

  @Get('token/create')
  createToken(@AuthUser() user, @Body() createRoomDto: CreateRoomDto) {
    try {
      return this.liveKitService.createToken(createRoomDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
