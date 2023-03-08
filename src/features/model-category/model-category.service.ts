import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import {
  CreateModelCategoryDto,
  UpdateModelCategoryDto,
} from './create-model-category.dto';
import { ModelCategoryDocument } from './model-category.model';

@Injectable()
export class ModelCategoryService {
  constructor(
    @InjectModel(collectionNames.modelCategory)
    private modelCategoryModel: Model<ModelCategoryDocument>,
  ) {}
  async create(dto: CreateModelCategoryDto) {
    const found = await this.modelCategoryModel.findOne({
      name: dto.name,
    });
    if (found) throw new BadRequestException('Category already exist');
    return await this.modelCategoryModel.create(dto);
  }

  async findAll() {
    return await this.modelCategoryModel.find();
  }

  async findOne(id: string) {
    const modelCategory = await this.modelCategoryModel.findById(id);
    if (!modelCategory) throw new NotFoundException('Category not found');
    return modelCategory;
  }

  async update(id: string, dto: UpdateModelCategoryDto) {
    const modelCategory = await this.findOne(id);
    await modelCategory.updateOne(dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const modelCategory = await this.findOne(id);
    modelCategory.remove();
    return modelCategory;
  }
}
