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
import { Multer } from 'multer';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import {
  CreateContentCommentDto,
  UpdateContnetCommentDto,
} from './content-comment.dto';
import { ContentCommentService } from './content-comment.service';

@Controller('content-comment')
@UseGuards(JwtAuthGuard)
export class ContentCommentController {
  constructor(private readonly contentCommentService: ContentCommentService) {}

  @UseInterceptors(FileInterceptor('file'))
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentCommentService.findOne(id);
  }

  @Get('content/:contentId')
  findByContent(@Param('contentId') contentId: string) {
    return this.contentCommentService.findByContent(contentId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() form: UpdateContnetCommentDto) {
    return this.contentCommentService.update(id, form);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentCommentService.remove(id);
  }
}
