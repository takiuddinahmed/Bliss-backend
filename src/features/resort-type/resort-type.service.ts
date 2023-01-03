import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { generatePermalink } from '../utils';
import { CreateResortTypeDto, UpdateResortTypeDto } from './resort-type.dto';
import {
  ResortTypeDocument,
  ResortTypeDocumentWithId,
} from './resort-type.model';

@Injectable()
export class ResortTypeService {
  constructor(
    @InjectModel(collectionNames.resortType)
    private resortTypeModel: Model<ResortTypeDocumentWithId>,
  ) {}
  async create(dto: CreateResortTypeDto) {
    dto.permalink = await generatePermalink(dto.type, this.resortTypeModel);
    return await this.resortTypeModel.create(dto);
  }

  async getAll() {
    return await this.resortTypeModel.find();
  }

  async getById(id: string, allowNull = false) {
    const resortType = await this.resortTypeModel.findById(id);
    if (!resortType && !allowNull) {
      throw new NotFoundException('Resort type not found');
    }
    return resortType;
  }

  async update(id: string, dto: UpdateResortTypeDto) {
    const resortType = await this.getById(id);
    await resortType.updateOne(dto);
    return await this.getById(id);
  }

  async remove(id: string) {
    const resortType = await this.getById(id);
    await resortType.remove();
    return resortType;
  }
}
