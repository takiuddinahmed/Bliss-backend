import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.model';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async getCategories() {
    return await this.categoryModel.find();
  }

  async getCategory(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new Error('Catergory not found');
    }
    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const found = await this.categoryModel.findOne({
      name: createCategoryDto.name,
      sexuality: createCategoryDto.sexuality,
    });
    if (found) throw new Error('Category already exist!');
    const newCategory = await this.categoryModel.create(createCategoryDto);
    return newCategory;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const found = await this.categoryModel.findById(id);
    if (!found) throw new Error('Category not found!');
    return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true,
    });
  }

  async deleteCategory(id: string) {
    const found = await this.categoryModel.findById(id);
    if (!found) {
      throw new Error('Category not found!');
    }
    return await this.categoryModel.findByIdAndDelete(id);
  }
}
