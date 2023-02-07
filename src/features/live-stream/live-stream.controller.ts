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
} from '@nestjs/common';
import { LiveStreamService } from './live-stream.service';
import { CreateLiveStreamDto } from './dto/create-live-stream.dto';
import { UpdateLiveStreamDto } from './dto/update-live-stream.dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../security';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('LiveStream')
@ApiBearerAuth()
@Controller('livestream')
export class LiveStreamController {
  constructor(private readonly liveStreamService: LiveStreamService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createLiveStreamDto: CreateLiveStreamDto) {
    try {
      return this.liveStreamService.create(createLiveStreamDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.liveStreamService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.liveStreamService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLiveStreamDto: UpdateLiveStreamDto,
  ) {
    return this.liveStreamService.update(+id, updateLiveStreamDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liveStreamService.remove(id);
  }
}
