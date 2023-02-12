import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  collectionNames,
  FileData,
  PaginationQuery,
  VisualityEnum,
} from '../common';
import { LikeDislikeEnum } from '../common/enum/likeDislike.enum';
import { IAuthUser } from '../security';
import { SpaceService } from '../space/space.service';
import { ROLE } from '../user/user.model';
import { CreateNewsfeedDto, UpdateNewsfeedDto } from './newsfeed.dto';
import { Newsfeed, NewsfeedDocument, NewsfeedFiles } from './newsfeed.model';

@Injectable()
export class NewsfeedService {
  constructor(
    @InjectModel(collectionNames.newsfeed)
    private newsfeedModel: Model<NewsfeedDocument>,
    private spaceService: SpaceService,
  ) {}

  async create(dto: CreateNewsfeedDto, user: IAuthUser, files?: NewsfeedFiles) {
    dto.userId = user?._id?.toString();
    dto.files = await this.multiUpload(files?.files);
    dto.thumbnails = await this.multiUpload(files?.thumbnails);
    const newsfeed = await this.newsfeedModel.create(dto);
    return await this.newsfeedModel.findById(newsfeed?._id);
  }

  async findByFilter(
    filter: FilterQuery<NewsfeedDocument> = {},
    pagination: PaginationQuery = {},
  ) {
    return await this.newsfeedModel
      .find({
        ...filter,
        visualiTy: VisualityEnum.PUBLIC,
      })
      .skip(pagination?.from || 0)
      .limit(pagination?.count || 10)
      .sort({ updatedAt: -1 });
  }

  async findAll() {
    return await this.newsfeedModel.find();
  }

  async findById(id: string) {
    const newsfeed = await this.newsfeedModel.findById(id);
    if (!newsfeed) throw new NotFoundException('Newsfeed not found');
    return newsfeed;
  }

  async findByPermalink(permalink: string) {
    const newsfeed = await this.newsfeedModel.findOne({ permalink });
    if (!newsfeed) throw new NotFoundException('Newsfeed not found');
    return newsfeed;
  }

  async update(
    id: string,
    dto: UpdateNewsfeedDto,
    user: IAuthUser,
    files?: NewsfeedFiles,
  ) {
    const newsfeed = await this.findById(id);
    if (
      !(
        user?.role === ROLE.ADMIN ||
        user?.id?.toString() === newsfeed?.userId?.toString()
      )
    )
      throw new UnauthorizedException('unauthorise');
    dto.files = [
      ...(dto?.oldFiles || []),
      ...(await this.multiUpload(files.files)),
    ];
    dto.thumbnails = [
      ...newsfeed.thumbnails,
      ...(await this.multiUpload(files.thumbnails)),
    ];
    await newsfeed.updateOne(dto);
    return await this.findById(id);
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

    const comment = await this.newsfeedModel.findById(id);
    if (likeDislike === 'cancel') {
      return await this.newsfeedModel.findByIdAndUpdate(
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
      return await this.newsfeedModel.findOneAndUpdate(
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
      return await this.newsfeedModel.findByIdAndUpdate(
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

  async remove(id: string, user: IAuthUser) {
    const newsfeed = await this.findById(id);

    if (
      user?.role !== ROLE.ADMIN ||
      (user?.role !== ROLE.ADMIN &&
        user?.id?.toString() !== newsfeed?.userId?.toString())
    ) {
      throw new UnauthorizedException('unauthorise');
    }
    await newsfeed.remove();
    return newsfeed;
  }

  async singleUpload(files: Express.Multer.File[]) {
    if (files?.length) {
      const fileData = await this.spaceService.uploadFile(files[0]);
      if (!fileData)
        throw new InternalServerErrorException('File upload failed');
      return fileData;
    }
    return {};
  }

  async multiUpload(files: Express.Multer.File[]) {
    const fileData: FileData[] = [];
    if (files?.length) {
      for (let i = 0; i < files.length; i++) {
        const uploadedFile = await this.spaceService.uploadFile(files[i]);
        if (!uploadedFile)
          throw new InternalServerErrorException('File upload failed');
        fileData[i] = uploadedFile;
      }
    }
    return fileData;
  }
}
