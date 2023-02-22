import { Module } from '@nestjs/common';
import { NewsfeedCommentService } from './newsfeed-comment.service';
import { NewsfeedCommentController } from './newsfeed-comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { NewsfeedCommentSchema } from './newsfeed-comment.model';
import { SpaceModule } from '../space';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.newsfeedComment, schema: NewsfeedCommentSchema },
    ]),
    SpaceModule,
  ],
  controllers: [NewsfeedCommentController],
  providers: [NewsfeedCommentService],
})
export class NewsfeedCommentModule {}
