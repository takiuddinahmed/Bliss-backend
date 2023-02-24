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
import { RestaurantsService } from '../restaurants/restaurants.service';
import { IAuthUser } from '../security';
import { SpaceService } from '../space/space.service';
import { generatePermalink } from '../utils';
import {
  DAY_THRESHOLD_FOR_TRENDING,
  RATING_COUNT_THRESHOLD_FOR_POPULAR,
} from './constant';
import {
  CreateRestaurantMenuDto,
  UpdateRestaurantMenuDto,
} from './restaurant-menu.dto';
import {
  RestaurantMenuDocument,
  RestaurantMenuFiles,
} from './restaurant-menu.model';
import * as moment from 'moment';

@Injectable()
export class RestaurantMenuService {
  constructor(
    @InjectModel(collectionNames.restaurantMenu)
    private restaurantMenuModel: Model<RestaurantMenuDocument>,
    private spaceService: SpaceService,
    private restaurantsService: RestaurantsService,
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
    return await this.restaurantMenuModel
      .find()
      .populate('restaurantCategoryId');
  }

  async getTrending() {
    const date = moment()
      .subtract(DAY_THRESHOLD_FOR_TRENDING, 'days')
      .toISOString();

    return await this.restaurantMenuModel.aggregate([
      {
        $match: {
          'ratingReviews': {
            $exists: true,
            $ne: [],
          },
          'ratingReviews.updatedAt': { $gte: date },
        },
      },
      { $unwind: { path: '$ratingReviews' } },
      {
        $group: {
          _id: '$_id',
          ratingCount: { $sum: 1 },
          userId: { $first: '$userId' },
          restaurantId: { $first: '$restaurantId' },
          name: { $first: '$name' },
          quantity: { $first: '$quantity' },
          restaurantCategoryId: { $first: '$restaurantCategoryId' },
          price: { $first: '$price' },
          description: { $first: '$description' },
          featured: { $first: '$featured' },
          popular: { $first: '$popular' },
          image: { $first: '$image' },
          thumbnails: { $first: '$thumbnails' },
          permalink: { $first: '$permalink' },
          likeDislikes: { $first: '$likeDislikes' },
          ratingReviews: { $push: '$ratingReviews' },
        },
      },
      { $match: { ratingCount: { $gte: RATING_COUNT_THRESHOLD_FOR_POPULAR } } },
      { $sort: { ratingCount: -1 } },
    ]);
  }

  async getPopular() {
    return await this.restaurantMenuModel.aggregate([
      { $match: { ratingReviews: { $exists: true, $ne: [] } } },
      { $unwind: { path: '$ratingReviews' } },
      {
        $group: {
          _id: '$_id',
          ratingCount: { $sum: 1 },
          userId: { $first: '$userId' },
          restaurantId: { $first: '$restaurantId' },
          name: { $first: '$name' },
          quantity: { $first: '$quantity' },
          restaurantCategoryId: { $first: '$restaurantCategoryId' },
          price: { $first: '$price' },
          description: { $first: '$description' },
          featured: { $first: '$featured' },
          popular: { $first: '$popular' },
          image: { $first: '$image' },
          thumbnails: { $first: '$thumbnails' },
          permalink: { $first: '$permalink' },
          likeDislikes: { $first: '$likeDislikes' },
          ratingReviews: { $push: '$ratingReviews' },
        },
      },
      { $match: { ratingCount: { $gte: RATING_COUNT_THRESHOLD_FOR_POPULAR } } },
      { $sort: { ratingCount: -1 } },
    ]);
  }

  async findByRestaurant(restaurantId: string) {
    return await this.restaurantMenuModel
      .find({ restaurantId })
      .populate('restaurantCategoryId');
  }

  async findByRestaurantPermalink(restaurantPermalink: string) {
    const restaurant = await this.restaurantsService.findByPermalink(
      restaurantPermalink,
    );
    return await this.restaurantMenuModel
      .find({
        restaurantId: restaurant._id?.toString(),
      })
      .populate('restaurantCategoryId');
  }

  async findOne(id: string, acceptNotFound = false) {
    const restaurantMenu = await this.restaurantMenuModel
      .findById(id)
      .populate('restaurantCategoryId');
    if (!restaurantMenu && !acceptNotFound)
      throw new NotFoundException('Restaurant Menu not found');
    return restaurantMenu;
  }

  async findOneByPermalink(permalink: string) {
    const restaurantMenu = await this.restaurantMenuModel
      .findOne({
        permalink,
      })
      .populate('restaurantCategoryId');
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
    // return await this.restaurantMenuModel.findByIdAndUpdate(id, dto, {
    //   new: true,
    // });
    await restaurantMenu.updateOne(dto);
    return await this.findOne(id);
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
      await this.restaurantMenuModel.findByIdAndUpdate(
        id,
        {
          ratingReviews: [{ userId, ...dto }],
        },
        { new: true },
      );
      return await this.findOne(id);
    } else if (
      restaurantMenu?.ratingReviews?.some(
        (rr) => rr?.userId?.toString() === userId,
      )
    ) {
      return restaurantMenu;
    } else {
      await this.restaurantMenuModel.findByIdAndUpdate(
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
      return this.findOne(id);
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
      await this.restaurantMenuModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            likeDislikes: { userId },
          },
        },
        { new: true },
      );
      return await this.findOne(id);
    }
    if (
      restaurantMenu.likeDislikes.some((ld) => ld.userId.toString() === userId)
    ) {
      await this.restaurantMenuModel.findOneAndUpdate(
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
      return await this.findOne(id);
    } else {
      await this.restaurantMenuModel.findByIdAndUpdate(
        id,
        {
          $push: {
            likeDislikes: { userId, likeDislike },
          },
        },
        { new: true },
      );
      return await this.findOne(id);
    }
  }

  async remove(id: string) {
    const restaurantMenu = await this.findOne(id);
    await restaurantMenu.remove();
    return restaurantMenu;
  }
}
