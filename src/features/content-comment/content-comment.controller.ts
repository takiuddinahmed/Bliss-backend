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
import { IAuthGuard } from '@nestjs/passport';
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

  @Post()
  create(@Body() form: CreateContentCommentDto, @AuthUser() user: IAuthUser) {
    form.userId = user._id.toString();
    return this.contentCommentService.create(form);
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
  findByContent(@Param('contentId') contentId: stirng) {
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
