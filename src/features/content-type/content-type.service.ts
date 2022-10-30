import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContentTypeDto, UpdateContentTypeDto } from './content-type.dto';
import { ContentType, ContentTypeDocument } from './content-type.model';

@Injectable()
export class ContentTypeService {
  constructor(
    @InjectModel(ContentType.name)
    private contentTypeModel: Model<ContentTypeDocument>,
  ) {}
  async create(input: CreateContentTypeDto) {
    const found = await this.contentTypeModel.findOne({ name: input.name });
    if (found) {
      throw new BadRequestException('Content type already exist');
    }
    return await this.contentTypeModel.create(input);
  }

  findAll() {
    return this.contentTypeModel.find();
  }

  async findOne(id: string) {
    const contentType = await this.contentTypeModel.findById(id);
    if (!contentType) throw new NotFoundException('Content type not found');
    return contentType;
  }

  async update(id: string, updateContentTypeInput: UpdateContentTypeDto) {
    const existContentType = await this.contentTypeModel.findById(id);
    if (!existContentType)
      throw new NotFoundException('Content type not found');
    return this.contentTypeModel.findByIdAndUpdate(id, updateContentTypeInput, {
      new: true,
    });
  }

  async remove(id: string) {
    const existContentType = await this.contentTypeModel.findById(id);
    if (!existContentType)
      throw new NotFoundException('Content type not found');
    return this.contentTypeModel.findByIdAndDelete(id);
  }
}
