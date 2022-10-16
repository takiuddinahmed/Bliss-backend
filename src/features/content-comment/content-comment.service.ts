import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(form: CreateContentCommentDto) {
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
    if (!contentComment) throw new NotFoundException('Commnet not fount');
    return contentComment;
  }

  update(id: string, updateContentCommentDto: UpdateContnetCommentDto) {
    return `This action updates a #${id} contentComment`;
  }

  remove(id: string) {
    return `This action removes a #${id} contentComment`;
  }
}
