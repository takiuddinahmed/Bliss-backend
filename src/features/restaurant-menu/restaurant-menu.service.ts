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
    if (files?.thumnails?.length) {
      dto.videos = [];
      for (let i = 0; i < files.thumnails.length; i++) {
        const fileData = await this.spaceService.uploadFile(
          files?.thumnails[i],
        );
        if (!fileData)
          throw new InternalServerErrorException('Thumnails upload failed');

        dto.thumnails[i] = fileData;
      }
    }

    return await this.restaurantMenuModel.create(dto);
  }

  async findAll() {
    return await this.restaurantMenuModel.find();
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

  update(id: string, updateRestaurantMenuDto: UpdateRestaurantMenuDto) {
    return `This action updates a #${id} restaurantMenu`;
  }

  remove(id: string) {
    return `This action removes a #${id} restaurantMenu`;
  }
}
