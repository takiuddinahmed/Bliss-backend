import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContentCommentService } from './content-comment.service';
import { CreateContentCommentDto } from './dto/create-content-comment.dto';
import { UpdateContentCommentDto } from './dto/update-content-comment.dto';

@Controller('content-comment')
export class ContentCommentController {
  constructor(private readonly contentCommentService: ContentCommentService) {}

  @Post()
  create(@Body() createContentCommentDto: CreateContentCommentDto) {
    return this.contentCommentService.create(createContentCommentDto);
  }

  @Get()
  findAll() {
    return this.contentCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentCommentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContentCommentDto: UpdateContentCommentDto) {
    return this.contentCommentService.update(+id, updateContentCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentCommentService.remove(+id);
  }
}
