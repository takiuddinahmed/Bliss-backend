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
  CreateRestaurantCategoryDto,
  UpdateRestaurantCategoryDto,
} from './restaurant-category.dto';
import { RestaurantCategoryDocument } from './restaurant-category.model';

@Injectable()
export class RestaurantCategoryService {
  constructor(
    @InjectModel(collectionNames.restaurantCatogory)
    private restaurantCategoryModel: Model<RestaurantCategoryDocument>,
    private spaceService: SpaceService,
  ) {}

  async create(dto: CreateRestaurantCategoryDto, image: Express.Multer.File) {
    dto.permalink = await generatePermalink(
      dto.name,
      this.restaurantCategoryModel,
    );
    if (image) {
      const fileData = await this.spaceService.uploadFile(image);
      if (!fileData)
        throw new InternalServerErrorException('File upload failed');
      dto.image = fileData;
    }
    return await this.restaurantCategoryModel.create(dto);
  }

  async findAll() {
    return await this.restaurantCategoryModel.find();
  }

  async findOne(id: string) {
    const restaurantCategory = await this.restaurantCategoryModel.findById(id);
    if (!restaurantCategory) {
      throw new NotFoundException('Restaurant Category Not found');
    }
    return restaurantCategory;
  }

  async findByPermalink(permalink: string) {
    const restaurantCategory = await this.restaurantCategoryModel.findOne({
      permalink,
    });
    if (!restaurantCategory) {
      throw new NotFoundException('Restaurant Category Not found');
    }
    return restaurantCategory;
  }

  async update(
    id: string,
    dto: UpdateRestaurantCategoryDto,
    image: Express.Multer.File,
  ) {
    await this.findOne(id);

    if (image) {
      const fileData = await this.spaceService.uploadFile(image);
      if (!fileData)
        throw new InternalServerErrorException('File upload failed');
      dto.image = fileData;
    }

    return await this.restaurantCategoryModel.findByIdAndUpdate(id, dto);
  }

  async remove(id: string) {
    const restaurantCategory = await this.findOne(id);
    restaurantCategory.remove();
    return restaurantCategory;
  }
}
