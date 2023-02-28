import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateStreamChatDto,
  SearchStreamChatDTO,
  UpdateStreamChatDto,
} from '../dto';
import { InjectModel } from '@nestjs/mongoose';
import { collectionNames } from '../../common';
import { Model } from 'mongoose';
import { LiveStreamChatDocument } from '../models/streaming-chat.model';
import { createSearchQuery } from '../../utils';

@Injectable()
export class StreamChatService {
  constructor(
    @InjectModel(collectionNames.streamingChat)
    private streamChatModel: Model<LiveStreamChatDocument>,
  ) {}

  async create(user, createLiveStreamDto: CreateStreamChatDto) {
    try {
      createLiveStreamDto.sender = user._id;
      return await this.streamChatModel.create(createLiveStreamDto);
    } catch (err) {
      console.log(err);
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  findAll(query: SearchStreamChatDTO) {
    try {
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;
      const cursor = this.streamChatModel
        .find(searchQuery)
        .limit(limit)
        .skip(skip);
      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }
      return cursor.exec();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateStreamChatDto: UpdateStreamChatDto, user) {
    try {
      const chat = await this.streamChatModel.findOne({
        _id: id,
      });
      if (!chat) {
        throw new NotFoundException('Message not found');
      }
      return await chat.set(updateStreamChatDto).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: string) {
    try {
      return this.streamChatModel.findByIdAndDelete(id);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
