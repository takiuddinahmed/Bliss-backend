import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { SpaceService } from '../space/space.service';
import { generatePermalink } from '../utils';
import { Content, ContentFiles } from './content.model';
import { CreateContentDto } from './create-content.dto';
import { UpdateContentDto } from './update-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(collectionNames.content) private contentModel: Model<Content>,
    private spaceService: SpaceService,
  ) {}

  async getContents() {
    return await this.contentModel.find().populate('user');
  }

  async getContent(permalink: string) {
    const content = await this.contentModel.findOne({ permalink });
    console.log(content);
    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  async createContent(createContentDto: CreateContentDto, files: ContentFiles) {
    createContentDto.permalink = await generatePermalink(
      createContentDto.title,
      this.contentModel,
    );
    await this.uploadFiles(files);
    return await this.contentModel.create(createContentDto);
  }
  async updateContent(permalink: string, updateContentDto: UpdateContentDto) {
    const found = await this.contentModel.findOne({ permalink });
    if (!found) throw new BadRequestException('Content not found');

    return await this.contentModel.findOne({ permalink }, updateContentDto, {
      new: true,
    });
  }

  async deleteContent(permalink: string) {
    const found = await this.contentModel.findOne({ permalink });
    if (!found) throw new NotFoundException('Content not found');
    return await this.contentModel.findOneAndDelete({ permalink });
  }

  async uploadFiles(files: ContentFiles) {
    const file = files.file[0];
    const res = await this.spaceService.uploadFile(file, 'file');
    console.log({ res });
  }
}
