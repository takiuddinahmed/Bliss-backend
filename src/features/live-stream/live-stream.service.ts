import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateLiveStreamDto } from './dto/create-live-stream.dto';
import { UpdateLiveStreamDto } from './dto/update-live-stream.dto';
import { SearchLiveStreamDTO } from './dto/search-live-stream.dto';
import { InjectModel } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { Model } from 'mongoose';
import { LiveStreamDocument } from './live-stream.model';
import {
  generatePermalink,
  createSearchQuery,
  subDocUpdateWithArray,
} from '../utils';

@Injectable()
export class LiveStreamService {
  constructor(
    @InjectModel(collectionNames.livestream)
    private liveStreamModel: Model<LiveStreamDocument>,
  ) {}

  async create(user, createLiveStreamDto: CreateLiveStreamDto) {
    try {
      const permalink = await generatePermalink(
        createLiveStreamDto.title,
        this.liveStreamModel,
      );
      return await this.liveStreamModel.create({
        ...createLiveStreamDto,
        userId: user._id,
        permalink,
      });
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  findAll(query: SearchLiveStreamDTO) {
    try {
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;
      const cursor = this.liveStreamModel
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

  async findOne(id: string) {
    try {
      const record = await this.liveStreamModel.findById(id);
      if (!record) {
        return Promise.reject(new NotFoundException('Livestream not found'));
      }
      return record;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateLiveStreamDto: UpdateLiveStreamDto) {
    try {
      const livestream = await this.liveStreamModel.findOne({
        _id: id,
      });
      if (!livestream) {
        throw new NotFoundException('Livestream not found');
      }
      if (
        updateLiveStreamDto &&
        updateLiveStreamDto.hasOwnProperty('audiences')
      ) {
        const audiences = livestream.get('audiences') || [];
        updateLiveStreamDto.audiences = subDocUpdateWithArray(
          audiences,
          updateLiveStreamDto.audiences,
        );
      }
      return await livestream.set(updateLiveStreamDto).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: string) {
    try {
      return this.liveStreamModel.findByIdAndDelete(id);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
