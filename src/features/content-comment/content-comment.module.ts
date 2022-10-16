import { Module } from '@nestjs/common';
import { ContentCommentService } from './content-comment.service';
import { ContentCommentController } from './content-comment.controller';

@Module({
  controllers: [ContentCommentController],
  providers: [ContentCommentService]
})
export class ContentCommentModule {}
