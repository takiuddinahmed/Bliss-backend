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
import { CreateRatingReviewDto } from '../common/models/ratingReview.model';
import { IAuthUser } from '../security';
import { SpaceService } from '../space/space.service';
import { generatePermalink } from '../utils';
import {
  CreateRestaurantMenuDto,
  UpdateRestaurantMenuDto,
} from './restaurant-menu.dto';
import {
  RestaurantMenuDocument,
  RestaurantMenuFiles,
} from './restaurant-menu.model';

@Injectable()
export class RestaurantMenuService {
  constructor(
    @InjectModel(collectionNames.restaurantMenu)
    private restaurantMenuModel: Model<RestaurantMenuDocument>,
    private spaceService: SpaceService,
  ) {}

  async create(dto: CreateRestaurantMenuDto, files: RestaurantMenuFiles) {
    dto.permalink = await generatePermalink(dto.name, this.restaurantMenuModel);

    // check image
    if (files?.image?.length) {
      const fileData = await this.spaceService.uploadFile(files?.image[0]);
      if (!fileData)
        throw new InternalServerErrorException('Image upload failed');
      dto.image = fileData;
    }

    // check video gallery
    if (files?.videos?.length) {
      dto.videos = [];
      for (let i = 0; i < files.videos.length; i++) {
        const fileData = await this.spaceService.uploadFile(files?.videos[i]);
        if (!fileData)
          throw new InternalServerErrorException('Video upload failed');

        dto.videos[i] = fileData;
      }
    }
    // check video gallery
    if (files?.thumbnails?.length) {
      dto.thumbnails = [];
      for (let i = 0; i < files.thumbnails.length; i++) {
        const fileData = await this.spaceService.uploadFile(
          files?.thumbnails[i],
        );
        if (!fileData)
          throw new InternalServerErrorException('Thumnails upload failed');

        dto.thumbnails[i] = fileData;
      }
    }

    return await this.restaurantMenuModel.create(dto);
  }

  async findAll() {
    return await this.restaurantMenuModel.find();
  }

  async findByRestaurant(restaurantId: string) {
    return await this.restaurantMenuModel.find({ restaurantId });
  }

  async findOne(id: string, acceptNotFound = false) {
    const restaurantMenu = await this.restaurantMenuModel.findById(id);
    if (!restaurantMenu && !acceptNotFound)
      throw new NotFoundException('Restaurant Menu not found');
    return restaurantMenu;
  }

  async findOneByPermalink(permalink: string) {
    const restaurantMenu = await this.restaurantMenuModel.findOne({
      permalink,
    });
    if (!restaurantMenu)
      throw new NotFoundException('Restaurant Menu not found');
    return restaurantMenu;
  }

  async update(
    id: string,
    dto: UpdateRestaurantMenuDto,
    user: IAuthUser,
    files: RestaurantMenuFiles,
  ) {
    const restaurantMenu = await this.findOne(id);

    // check image
    if (files?.image?.length) {
      const fileData = await this.spaceService.uploadFile(files?.image[0]);
      if (!fileData)
        throw new InternalServerErrorException('Image upload failed');
      dto.image = fileData;
    }

    // check video gallery
    if (files?.videos?.length) {
      dto.videos = [];
      for (let i = 0; i < files.videos.length; i++) {
        const fileData = await this.spaceService.uploadFile(files?.videos[i]);
        if (!fileData)
          throw new InternalServerErrorException('Video upload failed');

        dto.videos[i] = fileData;
      }
    }
    // check video gallery
    if (files?.thumbnails?.length) {
      dto.videos = [];
      for (let i = 0; i < files.thumbnails.length; i++) {
        const fileData = await this.spaceService.uploadFile(
          files?.thumbnails[i],
        );
        if (!fileData)
          throw new InternalServerErrorException('Thumbnails upload failed');

        dto.thumbnails[i] = fileData;
      }
    }
    return await this.restaurantMenuModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  async addRatingReview(
    id: string,
    userId: string,
    dto: CreateRatingReviewDto,
  ) {
    const restaurantMenu = await this.restaurantMenuModel.findById(id);
    if (!restaurantMenu)
      throw new NotFoundException('Restaurant menu not found');
    if (!restaurantMenu?.ratingReviews?.length) {
      return await this.restaurantMenuModel.findByIdAndUpdate(
        id,
        {
          ratingReviews: [{ userId, ...dto }],
        },
        { new: true },
      );
    } else if (
      restaurantMenu?.ratingReviews?.some(
        (rr) => rr?.userId?.toString() === userId,
      )
    ) {
      return restaurantMenu;
    } else {
      return await this.restaurantMenuModel.findByIdAndUpdate(
        id,
        {
          $push: {
            ratingReviews: {
              userId,
              ...dto,
            },
          },
        },
        { new: true },
      );
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

    const restaurantMenu = await this.restaurantMenuModel.findById(id);
    if (likeDislike === LikeDislikeEnum.CANCEL) {
      return await this.restaurantMenuModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            likeDislikes: { userId },
          },
        },
        { new: true },
      );
    }
    if (
      restaurantMenu.likeDislikes.some((ld) => ld.userId.toString() === userId)
    ) {
      return await this.restaurantMenuModel.findOneAndUpdate(
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
      return await this.restaurantMenuModel.findByIdAndUpdate(
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

  async remove(id: string) {
    const restaurantMenu = await this.findOne(id);
    await restaurantMenu.remove();
    return restaurantMenu;
  }
}
