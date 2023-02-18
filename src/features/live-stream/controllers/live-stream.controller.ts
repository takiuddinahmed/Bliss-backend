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
import { LiveStreamService } from '../services/live-stream.service';
import { CreateLiveStreamDto, UpdateLiveStreamDto } from '../dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../security';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchLiveStreamDTO } from '../dto/live-stream/search-live-stream.dto';
import { AuthUser } from '../../security/get-user.decorator';

@ApiTags('LiveStream')
@ApiBearerAuth()
@Controller('livestream')
export class LiveStreamController {
  constructor(private readonly liveStreamService: LiveStreamService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@AuthUser() user, @Body() createLiveStreamDto: CreateLiveStreamDto) {
    try {
      return this.liveStreamService.create(user, createLiveStreamDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: SearchLiveStreamDTO) {
    return this.liveStreamService.findAll(query);
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
    return this.liveStreamService.update(id, updateLiveStreamDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liveStreamService.remove(id);
  }
}
