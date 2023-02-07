import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LiveStreamService } from './live-stream.service';
import { CreateLiveStreamDto } from './dto/create-live-stream.dto';
import { UpdateLiveStreamDto } from './dto/update-live-stream.dto';

@Controller('live-stream')
export class LiveStreamController {
  constructor(private readonly liveStreamService: LiveStreamService) {}

  @Post()
  create(@Body() createLiveStreamDto: CreateLiveStreamDto) {
    return this.liveStreamService.create(createLiveStreamDto);
  }

  @Get()
  findAll() {
    return this.liveStreamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.liveStreamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLiveStreamDto: UpdateLiveStreamDto) {
    return this.liveStreamService.update(+id, updateLiveStreamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liveStreamService.remove(+id);
  }
}
