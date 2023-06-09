import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { LikeDislikeEnum } from '../common/enum/likeDislike.enum';
import { SpaceService } from '../space/space.service';
import {
  CreateContentCommentDto,
  UpdateContnetCommentDto,
} from './content-comment.dto';
import { ContentComment } from './content-comment.model';

@Injectable()
export class ContentCommentService {
  constructor(
    @InjectModel(collectionNames.contentComment)
    private contentCommentModel: Model<ContentComment>,
    private spaceService: SpaceService,
  ) {
    // this.deleteDeletedUserComment();
  }

  async create(form: CreateContentCommentDto, file?: Express.Multer.File) {
    if (file) {
      const fileData = await this.spaceService.uploadFile(file);
      if (!fileData)
        throw new InternalServerErrorException('Unable to upload file');
      form.file = fileData;
    }
    return await this.contentCommentModel.create(form);
  }

  async findAll() {
    return await this.contentCommentModel.find();
  }

  async findByContent(contentId: string) {
    return this.contentCommentModel.find({ contentId });
  }

  async likeDislikeCommnet(
    id: string,
    userId: string,
    likeDislike: LikeDislikeEnum | 'cancel',
  ) {
    if (
      !(
        likeDislike === LikeDislikeEnum.LIKE ||
        likeDislike === LikeDislikeEnum.DISLIKE ||
        likeDislike === 'cancel'
      )
    )
      throw new BadRequestException(
        `You have to select ${LikeDislikeEnum.LIKE} or ${LikeDislikeEnum.DISLIKE}`,
      );

    // TODO check comment and content is available

    const comment = await this.findOne(id);
    if (likeDislike === 'cancel') {
      return await this.contentCommentModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            likeDislikes: { userId },
          },
        },
        { new: true },
      );
    }
    if (comment.likeDislikes.some((ld) => ld.userId.toString() === userId)) {
      return await this.contentCommentModel.findOneAndUpdate(
        {
          '_id': id,
          'likeDislikes.userId': userId,
        },
        {
          $set: { 'likeDislikes.$.likeDislike': likeDislike },
        },
        {
          new: true,
        },
      );
    } else {
      return await this.contentCommentModel.findByIdAndUpdate(
        id,
        {
          $push: {
            likeDislikes: { userId, likeDislike },
          },
        },
        { new: true },
      );
    }
  }

  async getDocument(id: string) {
    const contentComment = await this.contentCommentModel.findById(id);
    if (!contentComment) throw new NotFoundException('Comment not found');
    return contentComment;
  }

  async findOne(id: string) {
    const contentComment = await this.contentCommentModel.findById(id);
    if (!contentComment) throw new NotFoundException('Comment not found');
    return contentComment;
  }

  async update(
    id: string,
    updateContentCommentDto: UpdateContnetCommentDto,
    file?: Express.Multer.File,
  ) {
    const contentComment = await this.getDocument(id);
    if (!contentComment) throw new NotFoundException('Comment not found');
    const prevFIle = contentComment.file;
    if (file) {
      const fileData = await this.spaceService.uploadFile(file);
      if (!fileData)
        throw new InternalServerErrorException('Unable to upload file');
      updateContentCommentDto.file = fileData;
    }
    const updated = await this.contentCommentModel.findByIdAndUpdate(
      id,
      updateContentCommentDto,
      { new: true },
    );
    if (updated) {
      this.spaceService.deleteFile(prevFIle);
    }
  }

  async remove(id: string) {
    const contentComment = await this.getDocument(id);
    if (!contentComment) throw new NotFoundException('Comment not found');
    if (contentComment.file && contentComment?.file?.spaceKey) {
      await this.spaceService.deleteFile(contentComment.file);
    }
    return await this.contentCommentModel.findByIdAndDelete(id);
  }

  async deleteDeletedUserComment() {
    const contentComments = await this.contentCommentModel.find();
    for (const contentComment of contentComments) {
      if (!contentComment.userId) {
        await contentComment.remove();
      }
    }
  }

  async findCommentedUserOfContent(contentId) {
    return this.contentCommentModel.distinct('userId', {
      contentId: contentId
    })
  }
}
