import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { NewsfeedService } from './newsfeed.service';
import { CreateNewsfeedDto, UpdateNewsfeedDto } from './newsfeed.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { NewsfeedFiles } from './newsfeed.model';

@ApiTags('Newsfeed')
@ApiBearerAuth()
@Controller('newsfeed')
export class NewsfeedController {
  constructor(private readonly newsfeedService: NewsfeedService) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 10 },
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

  @Get()
  async findAll() {
    return await this.newsfeedService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.newsfeedService.findById(id);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 10 },
      { name: 'thumbnails', maxCount: 5 },
    ]),
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewsfeedDto: UpdateNewsfeedDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: NewsfeedFiles,
  ) {
    return this.newsfeedService.update(id, updateNewsfeedDto, user, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsfeedService.remove(id);
  }
}
