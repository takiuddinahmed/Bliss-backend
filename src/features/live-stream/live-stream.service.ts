import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateLiveStreamDto } from './dto/create-live-stream.dto';
import { UpdateLiveStreamDto } from './dto/update-live-stream.dto';
import { InjectModel } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { Model } from 'mongoose';
import { LiveStreamDocument } from './live-stream.model';
import { generatePermalink } from '../utils';

@Injectable()
export class LiveStreamService {
  constructor(
    @InjectModel(collectionNames.livestream)
    private liveStreamModel: Model<LiveStreamDocument>,
  ) {}

  async create(createLiveStreamDto: CreateLiveStreamDto) {
    try {
      const permalink = await generatePermalink(
        createLiveStreamDto.title,
        this.liveStreamModel,
      );
      return await this.liveStreamModel.create({
        ...createLiveStreamDto,
        permalink,
      });
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all liveStream`;
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

  update(id: number, updateLiveStreamDto: UpdateLiveStreamDto) {
    return `This action updates a #${id} liveStream`;
  }

  remove(id: string) {
    try {
      return this.liveStreamModel.findByIdAndDelete(id);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
