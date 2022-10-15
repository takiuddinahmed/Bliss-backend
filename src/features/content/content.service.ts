import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
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

  async getContents() {
    return await this.contentModel.find();
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
    if (files?.file?.length) {
      const fileData = await this.uploadFile(files?.file[0]);
      if (!fileData)
        throw new InternalServerErrorException('File upload failed');
      createContentDto.file = fileData;
    }
    if (files?.thumbnails?.length) {
      const thumbnailsFileData: FileData[] = [];
      for await (const file of files.thumbnails) {
        const fileData = await this.uploadFile(file);
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

  async uploadFile(file: Express.Multer.File) {
    const fileName = file.originalname.replace(' ', '-');
    const res = await this.spaceService.uploadFile(file, fileName);
    if (res) {
      const fileData: FileData = {
        name: fileName,
        spaceKey: res.spaceKey,
        spaceUrl: res.spaceUrl,
        url: res.spaceUrl,
        // type: file.mimetype.toString(),
        size: file.size,
      };
      return fileData;
    }
    return null;
  }
}
