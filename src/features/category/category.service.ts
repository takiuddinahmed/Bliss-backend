import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { CategoryDocument } from './category.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(collectionNames.category)
    private categoryModel: Model<CategoryDocument>,
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

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const found = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (found) throw new BadRequestException('Category already exist');
    const newCategory = await this.categoryModel.create(createCategoryDto);
    return newCategory;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const found = await this.categoryModel.findById(id);
    if (!found) throw new NotFoundException('Category not found');
    return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true,
    });
  }

  async deleteCategory(id: string) {
    const found = await this.categoryModel.findById(id);
    if (!found) {
      throw new NotFoundException('Category not found');
    }
    return await this.categoryModel.findByIdAndDelete(id);
  }
}
