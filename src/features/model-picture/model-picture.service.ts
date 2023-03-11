import { Injectable } from '@nestjs/common';
import {
  CreateModelPictureDto,
  UpdateModelPictureDto,
} from './model-picture.dto';

@Injectable()
export class ModelPictureService {
  create(createModelPictureDto: CreateModelPictureDto) {
    return 'This action adds a new modelPicture';
  }

  findAll() {
    return `This action returns all modelPicture`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modelPicture`;
  }

  update(id: number, updateModelPictureDto: UpdateModelPictureDto) {
    return `This action updates a #${id} modelPicture`;
  }

  remove(id: number) {
    return `This action removes a #${id} modelPicture`;
  }
}
