import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { generatePermalink } from '../utils';
import { CategoryDocument } from './category.model';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(collectionNames.category)
    private categoryModel: Model<CategoryDocument>,
  ) {
    // this.migrate();
  }

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
    });
    if (found) throw new Error('Category already exist!');
    const permalink = await generatePermalink(
      createCategoryDto.name,
      this.categoryModel,
    );
    createCategoryDto.permalink = permalink;
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

  async migrate() {
    const categories = await this.categoryModel.find();
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      if (!category.permalink) {
        const permalink = await generatePermalink(
          category.name,
          this.categoryModel,
        );

        const updated = await this.categoryModel.findByIdAndUpdate(
          category._id,
          { permalink },
          { new: true },
        );
        console.log(updated);
      }
    }
  }
}
