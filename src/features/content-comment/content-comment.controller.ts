import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LikeDislikeEnum } from '../common/enum/likeDislike.enum';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import {
  CreateContentCommentDto,
  UpdateContnetCommentDto,
} from './content-comment.dto';
import { ContentCommentService } from './content-comment.service';
import { NotificationInterceptor } from '../notifications/interceptors/notifications.interceptor';

@ApiTags('Content Comment')
@ApiBearerAuth()
@Controller('content-comment')
export class ContentCommentController {
  constructor(private readonly contentCommentService: ContentCommentService) {}

  @UseInterceptors(NotificationInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() form: CreateContentCommentDto,
    @AuthUser() user: IAuthUser,
    @UploadedFile('file') file?: Express.Multer.File,
  ) {
    form.userId = user._id.toString();
    return this.contentCommentService.create(form, file);
  }

  @Get()
  findAll() {
    return this.contentCommentService.findAll();
  }

  @Get(':contentId/users')
  findAllUser(@Param('contentId') contentId: string) {
    return this.contentCommentService.findCommentedUserOfContent(contentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentCommentService.findOne(id);
  }

  @Get('content/:contentId')
  findByContent(@Param('contentId') contentId: string) {
    return this.contentCommentService.findByContent(contentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/like-dislike/:id/:likeDislike')
  async likeComment(
    @Param('id') id: string,
    @Param('likeDislike') likeDislike: LikeDislikeEnum | 'cancel',
    @AuthUser() user: IAuthUser,
  ) {
    return this.contentCommentService.likeDislikeCommnet(
      id,
      user._id.toString(),
      likeDislike,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() form: UpdateContnetCommentDto) {
    return this.contentCommentService.update(id, form);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentCommentService.remove(id);
  }
}
