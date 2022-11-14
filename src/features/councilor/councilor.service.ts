import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { LikeDislikeEnum } from '../common/enum/likeDislike.enum';
import { IAuthUser } from '../security';
import { SpaceService } from '../space/space.service';
import { ROLE } from '../user/user.model';
import { generatePermalink } from '../utils';
import { CreateCouncilorDto, UpdateCouncilorDto } from './councilor.dto';
import { CouncilorDocument, CouncilorFiles } from './councilor.model';

@Injectable()
export class CouncilorService {
  constructor(
    @InjectModel(collectionNames.councilor)
    private councilorModel: Model<CouncilorDocument>,
    private readonly spaceService: SpaceService,
  ) {
    // this.migrate();
  }

  // create coouncilor
  async createCouncilor(
    user: IAuthUser,
    dto: CreateCouncilorDto,
    files: CouncilorFiles,
  ) {
    const cheeckCouncilor = await this.councilorModel.findOne({
      userId: user._id,
    });
    if (cheeckCouncilor) {
      throw new BadRequestException('You already have a councilor form');
    }
    dto.permalink = await generatePermalink(dto.name, this.councilorModel);
    if (files?.profilePic?.length) {
      const fileData = await this.spaceService.uploadFile(files?.profilePic[0]);
      if (!fileData) {
        throw new InternalServerErrorException('Profile picture upload failed');
      }
      dto.profilePic = fileData;
    }

    if (files?.thumbnails?.length) {
      dto.thumbnails = [];
      for (let i = 0; i < files.thumbnails.length; i++) {
        const fileData = await this.spaceService.uploadFile(
          files?.thumbnails[i],
        );
        if (!fileData)
          throw new InternalServerErrorException('File upload failed');

        dto.thumbnails[i] = fileData;
      }
    }
    return this.councilorModel.create({
      ...dto,
      userId: user._id,
    });
  }

  async getAll() {
    return await this.councilorModel.find();
  }

  async getByUser(userId: string) {
    return await this.councilorModel.find({ userId });
  }

  async getOne(id: string) {
    const councilor = await this.councilorModel.findById(id);
    if (!councilor) {
      throw new NotFoundException('Councilor not found');
    }
    return councilor;
  }

  async getOneByPermalink(permalink: string) {
    const councilor = await this.councilorModel.findOne({ permalink });
    if (!councilor) {
      throw new NotFoundException('Councilor not found');
    }
    return councilor;
  }

  async update(
    id: string,
    dto: UpdateCouncilorDto,
    user: IAuthUser,
    files: CouncilorFiles,
  ) {
    const councilor = await this.councilorModel.findById(id);
    if (!councilor) {
      throw new NotFoundException('Councilor not found');
    }
    if (
      !(
        user?.role === ROLE.ADMIN ||
        user?._id?.toString() === councilor?.userId?.toString()
      )
    )
      throw new UnauthorizedException();
    if (files?.profilePic?.length) {
      const fileData = await this.spaceService.uploadFile(files?.profilePic[0]);
      if (!fileData) {
        throw new InternalServerErrorException('Profile picture upload failed');
      }
      dto.profilePic = fileData;
    }

    if (files?.thumbnails?.length) {
      dto.thumbnails = [];
      for (let i = 0; i < files.thumbnails.length; i++) {
        const fileData = await this.spaceService.uploadFile(
          files?.thumbnails[i],
        );
        if (!fileData)
          throw new InternalServerErrorException('File upload failed');

        dto.thumbnails[i] = fileData;
      }
    }
    return this.councilorModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    const councilor = await this.councilorModel.findById(id);
    if (!councilor) {
      throw new NotFoundException('Councilor not found');
    }
    councilor.remove();
    return councilor;
  }

  async follow(id: string, userId: string) {
    const restaurant = await this.councilorModel.findById(id);
    if (!restaurant) throw new NotFoundException('Councilor not found');
    if (restaurant.followers.some((user) => user?.toString() === userId)) {
      return restaurant;
    } else {
      return await this.councilorModel.findByIdAndUpdate(
        id,
        {
          $push: {
            followers: userId,
          },
        },
        { new: true },
      );
    }
  }
  async unfollow(id: string, userId: string) {
    const restaurant = await this.councilorModel.findById(id);
    if (!restaurant) throw new NotFoundException('Councilor not found');
    if (restaurant.followers.some((user) => user?.toString() === userId)) {
      return await this.councilorModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            followers: userId,
          },
        },
        { new: true },
      );
    } else {
      return restaurant;
    }
  }

  async likeDislikeContent(
    id: string,
    userId: string,
    likeDislike: LikeDislikeEnum,
  ) {
    if (
      !(
        likeDislike === LikeDislikeEnum.LIKE ||
        likeDislike === LikeDislikeEnum.DISLIKE ||
        likeDislike === LikeDislikeEnum.CANCEL
      )
    )
      throw new BadRequestException(
        `You have to select ${LikeDislikeEnum.LIKE} or ${LikeDislikeEnum.DISLIKE}`,
      );

    // TODO check comment and content is available

    const councilor = await this.councilorModel.findById(id);
    if (likeDislike === LikeDislikeEnum.CANCEL) {
      return await this.councilorModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            likeDislikes: { userId },
          },
        },
        { new: true },
      );
    }
    if (councilor.likeDislikes.some((ld) => ld.userId.toString() === userId)) {
      return await this.councilorModel.findOneAndUpdate(
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
      return await this.councilorModel.findByIdAndUpdate(
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

  async migrate() {
    const list = await this.councilorModel.find();
    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      if (!c?.permalink?.length) {
        await c.updateOne({
          permalink: await generatePermalink(c.name, this.councilorModel),
        });

        console.log(`${c.name} updated`);
      }
    }
  }
}
