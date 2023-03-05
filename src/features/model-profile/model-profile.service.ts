import { Injectable } from '@nestjs/common';
import {
  CreateModelProfileDto,
  UpdateModelProfileDto,
} from './model-profile.dto';
@Injectable()
export class ModelProfileService {
  create(createModelProfileDto: CreateModelProfileDto) {
    return 'This action adds a new modelProfile';
  }

  findAll() {
    return `This action returns all modelProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modelProfile`;
  }

  update(id: number, updateModelProfileDto: UpdateModelProfileDto) {
    return `This action updates a #${id} modelProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} modelProfile`;
  }
}
