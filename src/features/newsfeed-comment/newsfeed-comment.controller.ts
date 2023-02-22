import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { NewsfeedCommentService } from './newsfeed-comment.service';
import {
  CreateNewsfeedCommentDto,
  UpdateNewsfeedCommentDto,
} from './newsfeed-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import { LikeDislikeEnum } from '../common/enum/likeDislike.enum';

@ApiTags('Newsfeed Comment')
@ApiBearerAuth()
@Controller('newsfeed-comment')
export class NewsfeedCommentController {
  constructor(
    private readonly newsfeedCommentService: NewsfeedCommentService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateNewsfeedCommentDto,
    @AuthUser() user: IAuthUser,
    @UploadedFile('file') file?: Express.Multer.File,
  ) {
    dto.userId = user._id.toString();
    return this.newsfeedCommentService.create(dto, file);
  }

  @Get()
  findAll() {
    return this.newsfeedCommentService.findAll();
  }

  @Get('newsfeed/:newsfeedId')
  findByNewsfeed(@Param('newsfeedId') newsfeedId: string) {
    return this.newsfeedCommentService.findByNewsfeed(newsfeedId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsfeedCommentService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/like-dislike/:id/:likeDislike')
  async likeComment(
    @Param('id') id: string,
    @Param('likeDislike') likeDislike: LikeDislikeEnum | 'cancel',
    @AuthUser() user: IAuthUser,
  ) {
    return this.newsfeedCommentService.likeDislikeCommnet(
      id,
      user._id.toString(),
      likeDislike,
    );
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNewsfeedCommentDto,
    @AuthUser() user: IAuthUser,
    @UploadedFile('file') file?: Express.Multer.File,
  ) {
    return this.newsfeedCommentService.update(id, dto, user, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return this.newsfeedCommentService.remove(id, user);
  }
}
