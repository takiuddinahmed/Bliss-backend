import { Injectable } from '@nestjs/common';
import {
  CreateModelGalleryDto,
  UpdateModelGalleryDto,
} from './model-gallery.dto';
@Injectable()
export class ModelGalleryService {
  create(createModelGalleryDto: CreateModelGalleryDto) {
    return 'This action adds a new modelGallery';
  }

  findAll() {
    return `This action returns all modelGallery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modelGallery`;
  }

  update(id: number, updateModelGalleryDto: UpdateModelGalleryDto) {
    return `This action updates a #${id} modelGallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} modelGallery`;
  }
}
