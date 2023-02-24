import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { SpaceService } from '../space/space.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { CategoryDocument } from './category.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(collectionNames.category)
    private categoryModel: Model<CategoryDocument>,
    private spaceService: SpaceService,
  ) {}

  async getCategories() {
    return await this.categoryModel.find();
  }

  async getCategory(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Catergory not found');
    }
    return category;
  }

  async getCategoryByPermalink(permalink: string) {
    const category = await this.categoryModel.findOne({ permalink });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    image?: Express.Multer.File,
  ) {
    const found = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (found) throw new BadRequestException('Category already exist');
    if (image) {
      const fileData = await this.spaceService.uploadFile(image);
      if (!fileData)
        throw new InternalServerErrorException('Unable to upload file');
      createCategoryDto.image = fileData;
    }
    const newCategory = await this.categoryModel.create(createCategoryDto);
    return newCategory;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    image?: Express.Multer.File,
  ) {
    const found = await this.categoryModel.findById(id);
    if (!found) throw new NotFoundException('Category not found');
    if (image) {
      const fileData = await this.spaceService.uploadFile(image);
      if (!fileData)
        throw new InternalServerErrorException('Unable to upload file');
      updateCategoryDto.image = fileData;
    }
    return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true,
    });
  }

  async deleteCategory(id: string) {
    const found = await this.categoryModel.findById(id);
    if (!found) {
      throw new NotFoundException('Category not found');
    }
    await found.remove();
    return found;
  }
}
