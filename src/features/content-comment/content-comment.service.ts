import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { SpaceService } from '../space/space.service';
import {
  CreateContentCommentDto,
  UpdateContnetCommentDto,
} from './content-comment.dto';
import { ContentComment } from './content-comment.model';

@Injectable()
export class ContentCommentService {
  constructor(
    @InjectModel(collectionNames.contentComment)
    private contentCommentModel: Model<ContentComment>,
    private spaceService: SpaceService,
  ) {}

  async create(form: CreateContentCommentDto, file?: Express.Multer.File) {
    if (file) {
      const fileData = await this.spaceService.uploadFile(file);
      if (!fileData)
        throw new InternalServerErrorException('Unable to upload file');
      form.file = fileData;
    }
    return await this.contentCommentModel.create(form);
  }

  async findAll() {
    return await this.contentCommentModel.find();
  }

  async findByContent(contentId: string) {
    return this.contentCommentModel.find({ contentId });
  }

  async findOne(id: string) {
    const contentComment = await this.contentCommentModel.findById(id);
    if (!contentComment) throw new NotFoundException('Comment not found');
    return contentComment;
  }

  async update(
    id: string,
    updateContentCommentDto: UpdateContnetCommentDto,
    file?: Express.Multer.File,
  ) {
    const contentComment = await this.contentCommentModel.findById(id);
    if (!contentComment) throw new NotFoundException('Comment not found');
    const prevFIle = contentComment.file;
    if (file) {
      const fileData = await this.spaceService.uploadFile(file);
      if (!fileData)
        throw new InternalServerErrorException('Unable to upload file');
      updateContentCommentDto.file = fileData;
    }
    const updated = await this.contentCommentModel.findByIdAndUpdate(
      id,
      updateContentCommentDto,
      { new: true },
    );
    if (updated) {
      this.spaceService.deleteFile(prevFIle);
    }
  }

  async remove(id: string) {
    const contentComment = await this.contentCommentModel.findById(id);
    if (!contentComment) throw new NotFoundException('Comment not found');
    return this.contentCommentModel.findByIdAndDelete(id);
  }
}
