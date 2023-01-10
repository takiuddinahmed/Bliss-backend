import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { generatePermalink } from '../utils';
import { CreateResortDto, UpdateResortDto } from './resort.dto';
import {
  ResortDocument,
  ResortDocumentWithId,
} from './resort.model';

@Injectable()
export class ResortService {
  constructor(
    @InjectModel(collectionNames.Resort)
    private ResortModel: Model<ResortDocumentWithId>,
  ) {}
  async create(dto: CreateResortDto) {
    dto.permalink = await generatePermalink(dto.type, this.ResortModel);
    return await this.ResortModel.create(dto);
  }

  async getAll() {
    return await this.ResortModel.find();
  }

  async getById(id: string, allowNull = false) {
    const Resort = await this.ResortModel.findById(id);
    if (!Resort && !allowNull) {
      throw new NotFoundException('Resort not found');
    }
    return Resort;
  }

  async update(id: string, dto: UpdateResortDto) {
    const Resort = await this.getById(id);
    await Resort.updateOne(dto);
    return await this.getById(id);
  }

  async remove(id: string) {
    const Resort = await this.getById(id);
    await Resort.remove();
    return Resort;
  }
}
