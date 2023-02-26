import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import { ChannelFiles } from './channel.model';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@ApiTags('Channel')
@ApiBearerAuth()
@Controller('channel')
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
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  @Post()
  @UseGuards(JwtAuthGuard)
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
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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

  @Put('subscribe/:channelId')
  @UseGuards(JwtAuthGuard)
  async subscribe(
    @Param('channelId') channelId: string,
    @AuthUser() user: IAuthUser,
  ) {
    return await this.channelService.subscribe(channelId, user._id.toString());
  }
  @Put('unsubscribe/:channelId')
  @UseGuards(JwtAuthGuard)
  async unsubscribe(
    @Param('channelId') channelId: string,
    @AuthUser() user: IAuthUser,
  ) {
    return await this.channelService.unsubscribe(
      channelId,
      user._id.toString(),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return await this.channelService.remove(id, user._id.toString());
  }
}
