import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContentTypeEnum } from '../common';
import { LifeStyleEnum } from '../common/enum';
import { LikeDislikeEnum } from '../common/enum/likeDislike.enum';
import {
  AuthUser,
  IAuthUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
} from '../security';
import { ROLE } from '../user/user.model';
import { NewsfeedHomepageQuery } from './newsfeed-homepage-query.dto';
import { CreateNewsfeedDto, UpdateNewsfeedDto } from './newsfeed.dto';
import { NewsfeedFiles } from './newsfeed.model';
import { NewsfeedService } from './newsfeed.service';

@ApiTags('Newsfeed')
@ApiBearerAuth()
@Controller('newsfeed')
export class NewsfeedController {
  constructor(private readonly newsfeedService: NewsfeedService) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 10 },
      { name: 'thumbnails', maxCount: 5 },
    ]),
  )
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createNewsfeedDto: CreateNewsfeedDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: NewsfeedFiles,
  ) {
    return await this.newsfeedService.create(createNewsfeedDto, user, files);
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
    name: 'anonymous',
    type: Boolean,
    required: false,
  })
  @ApiQuery({
    name: 'contentType',
    type: String,
    enum: ContentTypeEnum,
    required: false,
  })
  @ApiQuery({
    name: 'lifeStyle',
    type: String,
    enum: LifeStyleEnum,
    required: false,
  })
  @Get()
  async findFiltered(@Query() query: NewsfeedHomepageQuery) {
    const { from, count, ...filter } = query;
    return await this.newsfeedService.findByFilter(filter, { from, count });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @Get('all')
  async findAll() {
    return await this.newsfeedService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.newsfeedService.findById(id);
  }

  @Get('permalink/:permalink')
  async findByPermalink(@Param('permalink') permalink: string) {
    return await this.newsfeedService.findByPermalink(permalink);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 10 },
      { name: 'thumbnails', maxCount: 5 },
    ]),
  )


  @Get('/like-dislike/:id/:likeDislike')
  @UseGuards(JwtAuthGuard)
  async likeComment(
    @Param('id') id: string,
    @Param('likeDislike') likeDislike: LikeDislikeEnum | 'cancel',
    @AuthUser() user: IAuthUser,
  ) {
    return this.newsfeedService.likeDislikeContent(
      id,
      user._id.toString(),
      likeDislike,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewsfeedDto: UpdateNewsfeedDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: NewsfeedFiles,
  ) {
    return this.newsfeedService.update(id, updateNewsfeedDto, user, files);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    console.log('calling');
    return this.newsfeedService.remove(id, user);
  }
}
