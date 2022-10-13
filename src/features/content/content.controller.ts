import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../security';
import { ContentService } from './content.service';
import { CreateContentDto } from './create-content.dto';
import { UpdateContentDto } from './update-content.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return await this.contentService.getContents();
  }

  @Get(':permalink')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('permalink') permalink: string) {
    return await this.contentService.getContent(permalink);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createContentDto: CreateContentDto) {
    return await this.contentService.createContent(createContentDto);
  }

  @Patch(':permalink')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('permalink') permalink: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return await this.contentService.updateContent(permalink, updateContentDto);
  }

  @Delete(':permalink')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('permalink') permalink: string) {
    return await this.contentService.deleteContent(permalink);
  }
}
