import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  collectionNames,
  FileData,
  ContentTypeEnum,
  PaginationQuery,
} from '../common';
import { LikeDislikeEnum } from '../common/enum/likeDislike.enum';
import { SpaceService } from '../space/space.service';
import { generatePermalink } from '../utils';
import { Content, ContentFiles } from './content.model';
import { CreateContentDto } from './create-content.dto';
import { UpdateContentDto } from './update-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(collectionNames.content) private contentModel: Model<Content>,
    private spaceService: SpaceService,
  ) {}

  async getContentByCategoryAndContentType(
    categoryId: string,
    contentType: string,
  ) {
    return await this.contentModel
      .find({
        categoryId,
        contentType,
      })
      .sort({ updatedAt: -1 });
  }

  async getContentByCategory(categoryId: string) {
    return await this.contentModel
      .find({
        categoryId,
      })
      .sort({ updatedAt: -1 });
  }

  async getContents() {
    return await this.contentModel.find().sort({ updatedAt: -1 });
  }

  async getVideos(
    filter: FilterQuery<Content> = {},
    pagination: PaginationQuery = {},
  ) {
    return await this.contentModel
      .find({
        ...filter,
        contentType: ContentTypeEnum.VIDEO,
      })
      .skip(pagination?.from || 0)
      .limit(pagination?.count || 10)
      .sort({ updatedAt: -1 });
  }

  async getContent(permalink: string) {
    const content = await this.contentModel.findOne({ permalink });
    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  async getContentByUser(userId: string) {
    return await this.contentModel.find({ userId }).sort({ updatedAt: -1 });
  }

  async getContentByChannel(channelId: string) {
    return await this.contentModel.find({ channelId }).sort({ updatedAt: -1 });
  }

  async getFunVideoContents(filter: FilterQuery<Content> = {}) {
    return await this.contentModel
      .find({ ...filter, isFunVideo: true })
      .sort({ updatedAt: -1 });
  }

  async createContent(createContentDto: CreateContentDto, files: ContentFiles) {
    createContentDto.permalink = await generatePermalink(
      createContentDto.title,
      this.contentModel,
    );
    if (files?.file?.length) {
      const fileData = await this.spaceService.uploadFile(files?.file[0]);
      if (!fileData)
        throw new InternalServerErrorException('File upload failed');
      createContentDto.file = fileData;
    }
    if (files?.thumbnails?.length) {
      const thumbnailsFileData: FileData[] = [];
      for await (const file of files.thumbnails) {
        const fileData = await this.spaceService.uploadFile(file);
        if (fileData) thumbnailsFileData.push(fileData);
      }
      createContentDto.thumbnails = thumbnailsFileData;
    }
    return await this.contentModel.create(createContentDto);
  }
  async updateContent(
    permalink: string,
    updateContentDto: UpdateContentDto,
    thumbnails?: Express.Multer.File[],
  ) {
    const found = await this.contentModel.findOne({ permalink });
    if (!found) throw new BadRequestException('Content not found');

    const thumbnailsFileData: FileData[] = [];
    if (thumbnails.length) {
      for await (const file of thumbnails) {
        const fileData = await this.spaceService.uploadFile(file);
        if (fileData) thumbnailsFileData.push(fileData);
      }
    }

    updateContentDto.thumbnails = [
      ...thumbnailsFileData,
      ...(updateContentDto.oldThumbnails || []),
    ];

    return await this.contentModel.findOne({ permalink }, updateContentDto, {
      new: true,
    });
  }

  async likeDislikeContent(
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

    const comment = await this.contentModel.findById(id);
    if (likeDislike === 'cancel') {
      return await this.contentModel.findByIdAndUpdate(
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
      return await this.contentModel.findOneAndUpdate(
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
      return await this.contentModel.findByIdAndUpdate(
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

  async addUserToFavorite(id: string, userId: string) {
    const content = await this.getById(id);
    if (content?.favorites?.some((uId) => uId.toString() === userId)) {
      return content;
    } else {
      return await this.contentModel.findByIdAndUpdate(
        id,
        {
          $push: { favorites: userId },
        },
        { new: true },
      );
    }
  }
  async removeUserFromFavorite(id: string, userId: string) {
    const content = await this.getById(id);
    if (content?.favorites?.some((uId) => uId.toString() === userId)) {
      return await this.contentModel.findByIdAndUpdate(
        id,
        {
          $pull: { favorites: userId },
        },
        { new: true },
      );
    } else {
      return content;
    }
  }

  async getById(id: string) {
    const content = await this.contentModel.findById(id);
    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  async getUserFavoriteContents(userId: string) {
    return await this.contentModel
      .find({ favorites: userId })
      .sort({ updatedAt: -1 });
  }

  async addUserView(id: string, userId: string) {
    const content = await this.getById(id);
    if (content?.views?.some((view) => view.userId === userId)) {
      return await this.contentModel.findOneAndUpdate(
        { '_id': id, 'views.userId': userId },
        {
          $inc: { 'views.$.viewCount': 1 },
        },
        { new: true },
      );
    } else {
      return await this.contentModel.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            views: {
              userId,
              viewCount: 1,
            },
          },
        },
        { new: true },
      );
    }
  }

  async deleteContent(permalink: string) {
    const found = await this.contentModel.findOne({ permalink });
    if (!found) throw new NotFoundException('Content not found');
    return await this.contentModel.findOneAndDelete({ permalink });
  }
}
