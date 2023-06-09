import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
import { createSearchQuery, generatePermalink } from '../utils';
import {
  DAY_THRESHOLD_FOR_NEW,
  FAVORITE_THRESHOLD_FOR_POPULAR,
  TOTAL_VIEW_THRESHOLD_FOR_TRENDING,
} from './contants';
import { Content, ContentFiles } from './content.model';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import * as moment from 'moment';
import { ContentQueryDto } from './dto/content.dto';
import { SearchContentDTO } from './dto/search-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(collectionNames.content) private contentModel: Model<Content>,
    private spaceService: SpaceService,
  ) { }

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

  async findAll(query: SearchContentDTO) {
    try {
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 100;
      const skip: number = (query && query.skip) || 0;

      const cursor = this.contentModel
        .find(searchQuery)
        .populate('userId')
        .populate('categoryId')
        .populate('subCategoryId')
        .populate('channelId')
        .limit(limit)
        .skip(skip);
      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }
      return cursor.exec();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
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

  async getPopular(filter: FilterQuery<Content> = {}) {
    return await this.contentModel.aggregate([
      {
        $match: {
          favorites: { $elemMatch: { $exists: true, $ne: [] } },
          ...filter,
        },
      },
      { $addFields: { favoriteCount: { $size: '$favorites' } } },
      { $match: { favoriteCount: { $gte: FAVORITE_THRESHOLD_FOR_POPULAR } } },
      { $sort: { favoriteCount: -1 } },
      { $project: { favoriteCount: 0 } },
    ]);
  }

  async getTrending(filter: FilterQuery<Content> = {}) {
    return await this.contentModel.aggregate([
      { $match: { views: { $exists: true, $ne: [] }, ...filter } },
      { $unwind: { path: '$views' } },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          categoryId: { $first: '$categoryId' },
          subCategoryId: { $first: '$subCategoryId' },
          channelId: { $first: { $toObjectId: '$channelId' } },
          sexuality: { $first: '$sexuality' },
          contentType: { $first: '$contentType' },
          title: { $first: '$title' },
          description: { $first: '$description' },
          isFunVideo: { $first: '$isFunVideo' },
          file: { $first: '$file' },
          url: { $first: '$url' },
          visualiTy: { $first: '$visualiTy' },
          permalink: { $first: '$permalink' },
          likeDislikes: { $first: '$likeDislikes' },
          favorites: { $first: '$favorites' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          views: { $push: '$views' },
          thumbnails: { $first: '$thumbnails' },
          duration: { $first: '$duration' },
          totalViewCount: {
            $sum: '$views.viewCount',
          },
        },
      },
      {
        $match: { totalViewCount: { $gte: TOTAL_VIEW_THRESHOLD_FOR_TRENDING } },
      },
      { $sort: { totalViewCount: -1 } },
      {
        $lookup: {
          from: collectionNames.channel,
          localField: 'channelId',
          foreignField: '_id',
          as: 'channels',
        },
      },
      {
        $addFields: {
          channel: { $arrayElemAt: ['$channels', 0] },
        },
      },
      { $project: { channels: 0 } },
    ]);
  }

  async getNew(dto: ContentQueryDto) {
    const date = moment().subtract(DAY_THRESHOLD_FOR_NEW, 'days').toISOString();
    const filter: FilterQuery<Content> = {};
    if (dto.categoryId) filter.categoryId = dto?.categoryId?.toString();
    if (dto.subCategoryId)
      filter.subCategoryId = dto?.subCategoryId?.toString();
    if (dto.contentType) filter.contentType = dto?.contentType;
    return await this.contentModel
      .find({ updatedAt: { $gte: date }, ...filter })
      .sort({ updatedAt: -1 });
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

    return await this.contentModel.findOneAndUpdate(
      { permalink },
      updateContentDto,
      {
        new: true,
      },
    );
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

  async addUserToLibrary(id: string, userId: string) {
    const content = await this.getById(id);
    if (content?.library?.some((uId) => uId.toString() === userId)) {
      return content;
    } else {
      return await this.contentModel.findByIdAndUpdate(
        id,
        {
          $push: { library: userId },
        },
        { new: true },
      );
    }
  }
  async removeUserFromLibrary(id: string, userId: string) {
    const content = await this.getById(id);
    if (content?.library?.some((uId) => uId.toString() === userId)) {
      return await this.contentModel.findByIdAndUpdate(
        id,
        {
          $pull: { library: userId },
        },
        { new: true },
      );
    } else {
      return content;
    }
  }

  async getUserLibraryContents(userId: string) {
    return await this.contentModel
      .find({ library: userId })
      .sort({ updatedAt: -1 });
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
