import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { LikeDislikeEnum } from '../common/enum/likeDislike.enum';
import { IAuthUser } from '../security';
import { SpaceService } from '../space/space.service';
import { ROLE } from '../user/user.model';
import {
  CreateNewsfeedCommentDto,
  UpdateNewsfeedCommentDto,
} from './newsfeed-comment.dto';
import { NewsfeedCommentDocument } from './newsfeed-comment.model';

@Injectable()
export class NewsfeedCommentService {
  constructor(
    @InjectModel(collectionNames.newsfeedComment)
    private newsfeedCommentModel: Model<NewsfeedCommentDocument>,
    private spaceService: SpaceService,
  ) {}

  async create(dto: CreateNewsfeedCommentDto, file?: Express.Multer.File) {
    if (file) {
      const fileData = await this.spaceService.uploadFile(file);
      if (!fileData)
        throw new InternalServerErrorException('Unable to upload file');
      dto.file = fileData;
    }
    return await this.newsfeedCommentModel.create(dto);
  }

  async findAll() {
    return await this.newsfeedCommentModel.find();
  }

  async findById(id: string) {
    const newsfeedComment = await this.newsfeedCommentModel.findById(id);
    if (!newsfeedComment)
      throw new NotFoundException('Newsfeed comment is not found');
    return newsfeedComment;
  }

  async findByNewsfeed(newsfeedId: string) {
    return await this.newsfeedCommentModel.find({ newsfeedId });
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

    const comment = await this.findById(id);
    if (likeDislike === 'cancel') {
      return await this.newsfeedCommentModel.findByIdAndUpdate(
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
      return await this.newsfeedCommentModel.findOneAndUpdate(
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
      return await this.newsfeedCommentModel.findByIdAndUpdate(
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

  async update(
    id: string,
    dto: UpdateNewsfeedCommentDto,
    user: IAuthUser,
    file?: Express.Multer.File,
  ) {
    const newsfeedComment = await this.findById(id);
    if (
      !(
        user.role === ROLE.ADMIN ||
        user?._id?.toString() === newsfeedComment.userId?.toString()
      )
    )
      throw new UnauthorizedException('Unauthorized');
    const prevFIle = newsfeedComment.file;
    if (file) {
      const fileData = await this.spaceService.uploadFile(file);
      if (!fileData)
        throw new InternalServerErrorException('Unable to upload file');
      dto.file = fileData;
    }
    const updated = await this.newsfeedCommentModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (updated && prevFIle && prevFIle?.spaceKey)
      this.spaceService.deleteFile(prevFIle);
    return updated;
  }

  async remove(id: string, user: IAuthUser) {
    const newsfeedComment = await this.findById(id);
    if (
      !(
        user.role === ROLE.ADMIN ||
        user?._id?.toString() === newsfeedComment.userId?.toString()
      )
    )
      throw new UnauthorizedException('Unauthorized');
    if (newsfeedComment?.file && newsfeedComment?.file?.spaceKey) {
      await this.spaceService.deleteFile(newsfeedComment.file);
    }
    await newsfeedComment.remove();
    return newsfeedComment;
  }
}
