import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createWriteStream } from 'fs';
import { Model } from 'mongoose';
import { join } from 'path';
import { collectionNames } from '../common';
import { Content } from './content.model';
import { CreateContentDto } from './create-content.dto';
import { UpdateContentDto } from './update-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(collectionNames.content) private contentModel: Model<Content>,
  ) {}

  async getContents() {
    return await this.contentModel.find().populate('user');
  }

  async getContent(id: string) {
    const content = await this.contentModel.findById(id).populate('user');
    console.log(content);
    if (!content) throw new Error('Content not found');
    return content;
  }

  async createContent(createContentDto: CreateContentDto) {
    if (createContentDto.file) {
      const { createReadStream, filename, mimetype } =
        await createContentDto.file;
      console.log({ filename, mimetype });
      const stream = createReadStream();
      const out = createWriteStream(join(__dirname, 'files', filename));
      stream.pipe(out);
      createContentDto.fileUrl = `http://localhost:5000/file/${filename}`;
    }
    console.log({ createContentDto });

    return await this.contentModel.create(createContentDto);
  }
  async updateContent(id: string, updateContentDto: UpdateContentDto) {
    const found = await this.contentModel.findById(id);
    if (!found) throw new Error('Content not found');

    if (updateContentDto.file) {
      const { createReadStream, filename, mimetype } =
        await updateContentDto.file;
      console.log({ filename, mimetype });
      const stream = createReadStream();
      const out = createWriteStream(join(__dirname, 'files', filename));
      stream.pipe(out);
      updateContentDto.fileUrl = `http://localhost:5000/file/${filename}`;
    }
    console.log({ updateContentDto });

    return await this.contentModel.findByIdAndUpdate(id, updateContentDto, {
      new: true,
    });
  }

  async deleteContent(id: string) {
    const found = await this.contentModel.findById(id);
    if (!found) throw new Error('Content not found');
    return await this.contentModel.findByIdAndDelete(id);
  }
}
