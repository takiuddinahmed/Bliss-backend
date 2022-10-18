import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import { ChannelFiles } from './channel.model';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channel')
@UseGuards(JwtAuthGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async findAll() {
    return await this.channelService.findAll();
  }

  @Get('permalink/:permalink')
  async findByPermalink(@Param('permalink') permalink: string) {
    return await this.channelService.findByPermalink(permalink);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.channelService.findOne(id);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'thumbnails', maxCount: 5 },
    ]),
  )
  @Post()
  async create(
    @Body() form: CreateChannelDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles()
    files: ChannelFiles,
  ) {
    form.userId = user._id.toString();
    return await this.channelService.create(form, files, user);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'thumbnails', maxCount: 5 },
    ]),
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() form: UpdateChannelDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles()
    files: ChannelFiles,
  ) {
    return await this.channelService.update(
      id,
      form,
      user._id.toString(),
      files,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return await this.channelService.remove(id, user._id.toString());
  }
}
