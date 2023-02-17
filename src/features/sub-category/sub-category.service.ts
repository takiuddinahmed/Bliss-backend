import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { SpaceService } from '../space/space.service';
import { generatePermalink } from '../utils';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './sub-category.dto';
import { SubCategoryDocument } from './sub-category.model';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(collectionNames.subCategory)
    private subCategoryModel: Model<SubCategoryDocument>,
    private spaceService: SpaceService,
  ) {}

  async create(input: CreateSubCategoryDto, image?: Express.Multer.File) {
    const found = await this.subCategoryModel.findOne({
      name: input.name,
      categoryId: input.categoryId,
    });
    if (found) throw new Error('Sub category already exist!');
    if (image) {
      const fileData = await this.spaceService.uploadFile(image);
      if (!fileData)
        throw new InternalServerErrorException('Unable to upload file');
      input.image = fileData;
    }
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
    return this.subCategoryModel.find().populate('categoryId');
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

  async update(
    id: string,
    updateSubCategoryInput: UpdateSubCategoryDto,
    image?: Express.Multer.File,
  ) {
    const subCategory = await this.subCategoryModel.findById(id);
    if (!subCategory) {
      throw new Error('Sub category not found');
    }
    if (image) {
      const fileData = await this.spaceService.uploadFile(image);
      if (!fileData)
        throw new InternalServerErrorException('Unable to upload file');
      updateSubCategoryInput.image = fileData;
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
