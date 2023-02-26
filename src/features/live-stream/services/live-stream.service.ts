import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateLiveStreamDto,
  UpdateLiveStreamDto,
  SearchLiveStreamDTO,
  CreateTokenDto,
  CreateRoomDto,
} from '../dto';
import { InjectModel } from '@nestjs/mongoose';
import { collectionNames } from '../../common';
import { Model } from 'mongoose';
import { LiveStreamDocument } from '../models/live-stream.model';
import {
  generatePermalink,
  createSearchQuery,
  subDocUpdateWithArray,
} from '../../utils';
import { LiveKitService } from './livekit.services';

@Injectable()
export class LiveStreamService {
  constructor(
    @InjectModel(collectionNames.livestream)
    private liveStreamModel: Model<LiveStreamDocument>,
    private readonly liveKitService: LiveKitService,
  ) {}

  async create(user, createLiveStreamDto: CreateLiveStreamDto) {
    try {
      const roomName = await generatePermalink(
        createLiveStreamDto.title,
        this.liveStreamModel,
      );
      const roomDTO = new CreateRoomDto();
      roomDTO.roomName = roomName;
      await this.liveKitService.createRoom(roomDTO);
      const tokenDTO = new CreateTokenDto();
      tokenDTO.roomName = roomName;
      // tokenDTO.participant = user.firstName + ' ' + user.lastName;
      tokenDTO.participant = user.email;
      const accessToken = this.liveKitService.createToken(tokenDTO);
      return await this.liveStreamModel.create({
        ...createLiveStreamDto,
        userId: user._id,
        roomName,
        accessToken,
      });
    } catch (err) {
      console.log(err);
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

  async findOneByRoom(room: string) {
    try {
      const record = await this.liveStreamModel.findOne({
        roomName: room,
      });
      if (!record) {
        return Promise.reject(new NotFoundException('Livestream not found'));
      }
      return record;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateLiveStreamDto: UpdateLiveStreamDto, user) {
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
        updateLiveStreamDto.audiences.map((audience) => {
          const roomDTO = new CreateTokenDto();
          roomDTO.roomName = livestream.roomName;
          // roomDTO.participant = user.firstName + ' ' + user.lastName;
          roomDTO.participant = user.email;
          const accessToken = this.liveKitService.createToken(roomDTO);
          audience.accessToken = accessToken;
        });
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
