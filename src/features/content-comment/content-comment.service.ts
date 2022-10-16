import { Injectable } from '@nestjs/common';
import { CreateContentCommentDto } from './dto/create-content-comment.dto';
import { UpdateContentCommentDto } from './dto/update-content-comment.dto';

@Injectable()
export class ContentCommentService {
  create(createContentCommentDto: CreateContentCommentDto) {
    return 'This action adds a new contentComment';
  }

  findAll() {
    return `This action returns all contentComment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contentComment`;
  }

  update(id: number, updateContentCommentDto: UpdateContentCommentDto) {
    return `This action updates a #${id} contentComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} contentComment`;
  }
}
