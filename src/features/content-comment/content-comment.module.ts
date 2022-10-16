import { Module } from '@nestjs/common';
import { ContentCommentService } from './content-comment.service';
import { ContentCommentController } from './content-comment.controller';
import { collectionNames } from '../common';
import { ContentCommnetSchema } from './content-comment.model';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceModule } from '../space';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.contentComment, schema: ContentCommnetSchema },
    ]),
    SpaceModule,
  ],
  controllers: [ContentCommentController],
  providers: [ContentCommentService],
})
export class ContentCommentModule {}
