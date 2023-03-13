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
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { LiveStreamService } from '../services/live-stream.service';
import { CreateLiveStreamDto, UpdateLiveStreamDto, ThumbnailsUploadDTO } from '../dto';
import { JwtAuthGuard } from '../../security';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchLiveStreamDTO } from '../dto/live-stream/search-live-stream.dto';
import { AuthUser } from '../../security/get-user.decorator';

@ApiTags('LiveStream')
@ApiBearerAuth()
@Controller('livestream')
export class LiveStreamController {
  constructor(private readonly liveStreamService: LiveStreamService) { }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnails', maxCount: 5 },
    ]),
  )
  @Post()
  create(
    @AuthUser() user,
    @Body() createLiveStreamDto: CreateLiveStreamDto,
    @UploadedFiles()
    files: ThumbnailsUploadDTO,
  ) {
    try {
      return this.liveStreamService.create(user, createLiveStreamDto, files);
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
  @Get('/room/:room')
  findOne(@Param('room') room: string) {
    return this.liveStreamService.findOneByRoom(room);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOneByRoom(@Param('id') id: string) {
    return this.liveStreamService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLiveStreamDto: UpdateLiveStreamDto,
    @AuthUser() user,
  ) {
    return this.liveStreamService.update(id, updateLiveStreamDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liveStreamService.remove(id);
  }
}
