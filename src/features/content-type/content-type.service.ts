import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentType, ContentTypeDocument } from './content-type.model';
import { CreateContentTypeInput } from './create-content-type.input';
import { UpdateContentTypeInput } from './update-content-type.input';

@Injectable()
export class ContentTypeService {
  constructor(
    @InjectModel(ContentType.name)
    private contentTypeModel: Model<ContentTypeDocument>,
  ) {}
  async create(input: CreateContentTypeInput) {
    const found = await this.contentTypeModel.findOne({ name: input.name });
    if (found) throw new Error('Content type already exist');
    return await this.contentTypeModel.create(input);
  }

  findAll() {
    return this.contentTypeModel.find();
  }

  async findOne(id: string) {
    const contentType = await this.contentTypeModel.findById(id);
    if (!contentType) throw new Error('Content type not found');
    return contentType;
  }

  async update(id: string, updateContentTypeInput: UpdateContentTypeInput) {
    const existContentType = await this.contentTypeModel.findById(id);
    if (!existContentType) throw new Error('Content type not found');
    return this.contentTypeModel.findByIdAndUpdate(id, updateContentTypeInput, {
      new: true,
    });
  }

  async remove(id: string) {
    const existContentType = await this.contentTypeModel.findById(id);
    if (!existContentType) throw new Error('Content type not found');
    return this.contentTypeModel.findByIdAndDelete(id);
  }
}
