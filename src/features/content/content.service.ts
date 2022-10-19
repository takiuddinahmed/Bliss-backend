import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames, FileData } from '../common';
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

  async getContentByCategoryAndContentType(
    categoryId: string,
    contentType: string,
  ) {
    return await this.contentModel.find({
      categoryId,
      contentType,
    });
  }

  async getContentByCategory(categoryId: string) {
    return await this.contentModel.find({
      categoryId,
    });
  }

  async getContents() {
    return await this.contentModel.find();
  }

  async getContent(permalink: string) {
    const content = await this.contentModel.findOne({ permalink });
    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  async createContent(createContentDto: CreateContentDto, files: ContentFiles) {
    createContentDto.permalink = await generatePermalink(
      createContentDto.title,
      this.contentModel,
    );
    if (files?.file?.length) {
      const fileData = await this.spaceService.uploadFile(files?.file[0]);
      if (!fileData)
        throw new InternalServerErrorException('File upload failed');
      createContentDto.file = fileData;
    }
    if (files?.thumbnails?.length) {
      const thumbnailsFileData: FileData[] = [];
      for await (const file of files.thumbnails) {
        const fileData = await this.spaceService.uploadFile(file);
        if (fileData) thumbnailsFileData.push(fileData);
      }
      createContentDto.thumbnails = thumbnailsFileData;
    }
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
}
