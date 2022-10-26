import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { SpaceService } from '../space/space.service';
import { generatePermalink } from '../utils';
import { CreateRestaurantDto, UpdateRestaurantDto } from './restaurant.dto';
import { Restaurant, RestaurantFiles } from './restaurant.model';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(collectionNames.restaurant)
    private restaurantModel: Model<Restaurant>,
    private spaceService: SpaceService,
  ) {}

  async create(
    dto: CreateRestaurantDto,
    userId: string,
    files: RestaurantFiles,
  ) {
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

  update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
