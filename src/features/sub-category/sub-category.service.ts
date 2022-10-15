import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { generatePermalink } from '../utils';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './sub-category.dto';
import { SubCategoryDocument } from './sub-category.model';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(collectionNames.subCategory)
    private subCategoryModel: Model<SubCategoryDocument>,
  ) {}

  async create(input: CreateSubCategoryDto) {
    const found = await this.subCategoryModel.findOne({
      name: input.name,
      categoryId: input.categoryId,
    });
    if (found) throw new Error('Sub category already exist!');
    const permalink = await generatePermalink(
      input.name,
      this.subCategoryModel,
    );
    return await this.subCategoryModel.create({
      ...input,
      permalink,
    });
  }

  async findAll() {
    return this.subCategoryModel.find();
  }

  async findByCategory(categoryId: string) {
    return await this.subCategoryModel.find({ categoryId });
  }

  async findOne(id: string) {
    const subCategory = await this.subCategoryModel.findById(id);
    if (!subCategory) {
      throw new Error('Sub category not found');
    }
    return subCategory;
  }

  async update(id: string, updateSubCategoryInput: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findById(id);
    if (!subCategory) {
      throw new Error('Sub category not found');
    }
    return this.subCategoryModel.findByIdAndUpdate(id, updateSubCategoryInput, {
      new: true,
    });
  }

  async remove(id: string) {
    const subCategory = await this.subCategoryModel.findById(id);
    if (!subCategory) {
      throw new Error('Sub category not found');
    }
    return this.subCategoryModel.findByIdAndDelete(id);
  }
}
