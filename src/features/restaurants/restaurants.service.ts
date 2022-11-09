import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { ROLE } from '../common/enum/user-role.enum';
import { IAuthUser } from '../security';
import { SpaceService } from '../space/space.service';
import { generatePermalink } from '../utils';
import { CreateRestaurantDto, UpdateRestaurantDto } from './restaurant.dto';
import {
  Restaurant,
  RestaurantDocument,
  RestaurantFiles,
} from './restaurant.model';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(collectionNames.restaurant)
    private restaurantModel: Model<RestaurantDocument>,
    private spaceService: SpaceService,
  ) {}

  async create(dto: CreateRestaurantDto, files: RestaurantFiles) {
    dto.permalink = await generatePermalink(dto.name, this.restaurantModel);

    // check logo
    if (files?.logo?.length) {
      const fileData = await this.spaceService.uploadFile(files?.logo[0]);
      if (!fileData)
        throw new InternalServerErrorException('File upload failed');
      dto.logo = fileData;
    }
    // check banner
    if (files?.banner?.length) {
      const fileData = await this.spaceService.uploadFile(files?.banner[0]);
      if (!fileData)
        throw new InternalServerErrorException('File upload failed');
      dto.banner = fileData;
    }
    // check photo gallery
    if (files?.photoGallery?.length) {
      dto.photoGallery = [];
      for (let i = 0; i < files.photoGallery.length; i++) {
        const fileData = await this.spaceService.uploadFile(
          files?.photoGallery[i],
        );
        if (!fileData)
          throw new InternalServerErrorException('File upload failed');

        dto.photoGallery[i] = fileData;
      }
    }

    console.log({ restaurantCreateDto: dto });

    return await this.restaurantModel.create(dto);
  }

  async findAll() {
    return await this.restaurantModel.find();
  }

  async findOne(id: string) {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async findByPermalink(permalink: string) {
    const restaurant = await this.restaurantModel.findOne({ permalink });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async update(
    id: string,
    dto: UpdateRestaurantDto,
    user: IAuthUser,
    files: RestaurantFiles,
  ) {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (!(user.role === ROLE.ADMIN || user._id.toString() === dto))
      throw new UnauthorizedException('Permission denied');

    // check logo
    if (files?.logo?.length) {
      const fileData = await this.spaceService.uploadFile(files?.logo[0]);
      if (!fileData)
        throw new InternalServerErrorException('File upload failed');
      dto.logo = fileData;
    }
    // check banner
    if (files?.banner?.length) {
      const fileData = await this.spaceService.uploadFile(files?.banner[0]);
      if (!fileData)
        throw new InternalServerErrorException('File upload failed');
      dto.banner = fileData;
    }
    // check photo gallery
    if (files?.photoGallery?.length) {
      dto.photoGallery = [];
      for (let i = 0; i < files.photoGallery.length; i++) {
        const fileData = await this.spaceService.uploadFile(
          files?.photoGallery[i],
        );
        if (!fileData)
          throw new InternalServerErrorException('File upload failed');

        dto.photoGallery[i] = fileData;
      }
    }
    return await this.restaurantModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return await this.restaurantModel.findByIdAndRemove(id);
  }

  async follow(id: string, userId: string) {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (restaurant.followers.some((user) => user?.toString() === userId)) {
      return restaurant;
    } else {
      return await this.restaurantModel.findByIdAndUpdate(id, {
        $push: {
          followers: userId,
        },
      });
    }
  }
  async unfollow(id: string, userId: string) {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (restaurant.followers.some((user) => user?.toString() === userId)) {
      return await this.restaurantModel.findByIdAndUpdate(id, {
        $pull: {
          followers: userId,
        },
      });
    } else {
      return restaurant;
    }
  }
}
