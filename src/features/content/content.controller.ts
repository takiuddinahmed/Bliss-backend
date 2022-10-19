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
import { ContentFiles } from './content.model';
import { ContentService } from './content.service';
import { CreateContentDto } from './create-content.dto';
import { UpdateContentDto } from './update-content.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  async getAll() {
    return await this.contentService.getContents();
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'thumbnails', maxCount: 5 },
    ]),
  )
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createContentDto: CreateContentDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles()
    files: ContentFiles,
  ) {
    createContentDto.userId = user._id.toString();
    return await this.contentService.createContent(createContentDto, files);
  }

  @Get('category/:categoryId/:contentType')
  async getContentByCategoryAndContentType(
    @Param('categoryId') categoryId: string,
    @Param('contentType') contentType: string,
  ) {
    return await this.contentService.getContentByCategoryAndContentType(
      categoryId,
      contentType,
    );
  }

  @Get('by-category/:categoryId')
  async getContentByCategory(@Param('categoryId') categoryId: string) {
    return await this.contentService.getContentByCategory(categoryId);
  }

  @Get(':permalink')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('permalink') permalink: string) {
    return await this.contentService.getContent(permalink);
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
