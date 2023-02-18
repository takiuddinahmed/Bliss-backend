import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SexualityEnum } from '../common';
import { LikeDislikeEnum } from '../common/enum/likeDislike.enum';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import { ContentVideoQueryDto } from './content-video-query.dto';
import { ContentFiles } from './content.model';
import { ContentService } from './content.service';
import { CreateContentDto } from './create-content.dto';
import { UpdateContentDto } from './update-content.dto';

@ApiTags('Content')
@ApiBearerAuth()
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  async getAll() {
    return await this.contentService.getContents();
  }

  @ApiQuery({
    name: 'from',
    type: Number,
    required: false,
    description: 'Return data from. Default 0',
  })
  @ApiQuery({
    name: 'count',
    type: Number,
    required: false,
    description: 'How many data requered. Default 10',
  })
  @ApiQuery({
    name: 'categoryId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'subCategoryId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'channelId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'sexuality',
    type: String,
    enum: SexualityEnum,
    required: false,
  })
  @Get('video')
  async getVideo(@Query() query: ContentVideoQueryDto) {
    const { from, count, ...filter } = query;
    return await this.contentService.getVideos(filter, { from, count });
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  async getUsersFavorites(@AuthUser() user: IAuthUser) {
    return await this.contentService.getUserFavoriteContents(
      user._id.toString(),
    );
  }

  @Get('popular')
  async getPopular() {
    return await this.contentService.getPopular();
  }

  @Get('library')
  @UseGuards(JwtAuthGuard)
  async getUsersLibrary(@AuthUser() user: IAuthUser) {
    return await this.contentService.getUserLibraryContents(
      user._id.toString(),
    );
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getContentByUser(@AuthUser() user: IAuthUser) {
    return await this.contentService.getContentByUser(user._id.toString());
  }

  @Get('fun-video')
  async getFunVideoContents() {
    return await this.contentService.getFunVideoContents();
  }

  @Get('fun-video/category/:categoryId')
  async getFunVideoBycategory(@Param('categoryId') categoryId: string) {
    return await this.contentService.getFunVideoContents({ categoryId });
  }

  @Get('channel/:channelId')
  async getContentByChannel(@Param('channelId') channelId: string) {
    return await this.contentService.getContentByChannel(channelId);
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
  async getOne(@Param('permalink') permalink: string) {
    return await this.contentService.getContent(permalink);
  }

  @Get('/like-dislike/:id/:likeDislike')
  @UseGuards(JwtAuthGuard)
  async likeComment(
    @Param('id') id: string,
    @Param('likeDislike') likeDislike: LikeDislikeEnum | 'cancel',
    @AuthUser() user: IAuthUser,
  ) {
    return this.contentService.likeDislikeContent(
      id,
      user._id.toString(),
      likeDislike,
    );
  }
  @Put('favorite/:id/:state')
  @UseGuards(JwtAuthGuard)
  async userFavorite(
    @Param('id') id: string,
    @Param('state') state: string,
    @AuthUser() user: IAuthUser,
  ) {
    if (state === 'add') {
      return await this.contentService.addUserToFavorite(
        id,
        user._id.toString(),
      );
    } else if (state === 'remove') {
      return await this.contentService.removeUserFromFavorite(
        id,
        user._id.toString(),
      );
    }
    return await this.contentService.getById(id);
  }

  @Put('library/:id/:state')
  @UseGuards(JwtAuthGuard)
  async userLibrary(
    @Param('id') id: string,
    @Param('state') state: string,
    @AuthUser() user: IAuthUser,
  ) {
    if (state === 'add') {
      return await this.contentService.addUserToLibrary(
        id,
        user._id.toString(),
      );
    } else if (state === 'remove') {
      return await this.contentService.removeUserFromLibrary(
        id,
        user._id.toString(),
      );
    }
    return await this.contentService.getById(id);
  }

  @Put('views/:id')
  @UseGuards(JwtAuthGuard)
  async addViews(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return this.contentService.addUserView(id, user._id.toString());
  }

  @Patch(':permalink')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('thumbnails[]'))
  async update(
    @Param('permalink') permalink: string,
    @Body() updateContentDto: UpdateContentDto,
    @UploadedFiles() thumbnails: Express.Multer.File[],
  ) {
    return await this.contentService.updateContent(
      permalink,
      updateContentDto,
      thumbnails,
    );
  }

  @Delete(':permalink')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('permalink') permalink: string) {
    return await this.contentService.deleteContent(permalink);
  }
}
