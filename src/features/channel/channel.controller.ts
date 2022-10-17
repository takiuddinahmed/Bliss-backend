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

  @Get(':permalink')
  async findOne(@Param('permalink') permalink: string) {
    return await this.channelService.findOne(permalink);
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
  @Patch(':permalink')
  async update(
    @Param('permalink') permalink: string,
    @Body() form: UpdateChannelDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles()
    files: ChannelFiles,
  ) {
    return await this.channelService.update(
      permalink,
      form,
      user._id.toString(),
      files,
    );
  }

  @Delete(':permalink')
  async remove(
    @Param('permalink') permalink: string,
    @AuthUser() user: IAuthUser,
  ) {
    return await this.channelService.remove(permalink, user._id.toString());
  }
}
