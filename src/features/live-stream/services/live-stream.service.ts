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
  ThumbnailsUploadDTO,
} from '../dto';
import { InjectModel } from '@nestjs/mongoose';
import { collectionNames, FileData } from '../../common';
import { Model } from 'mongoose';
import { LiveStreamDocument } from '../models/live-stream.model';
import {
  generatePermalink,
  createSearchQuery,
  subDocUpdateWithArray,
} from '../../utils';
import { LiveKitService } from './livekit.services';
import { SpaceService } from '../../space/space.service';


@Injectable()
export class LiveStreamService {
  constructor(
    @InjectModel(collectionNames.livestream)
    private liveStreamModel: Model<LiveStreamDocument>,
    private readonly liveKitService: LiveKitService,
    private readonly spaceService: SpaceService,
  ) { }

  async create(user, createLiveStreamDto: CreateLiveStreamDto, files: ThumbnailsUploadDTO) {
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
      tokenDTO.participant = user.email;
      const accessToken = this.liveKitService.createToken(tokenDTO);

      if (files?.thumbnails?.length) {
        const thumbnailsFileData: FileData[] = [];
        for await (const file of files.thumbnails) {
          const fileData = await this.spaceService.uploadFile(file);
          if (fileData) thumbnailsFileData.push(fileData);
        }
        createLiveStreamDto.thumbnails = thumbnailsFileData;
      }
      
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

  async findAll(query: SearchLiveStreamDTO) {
    try {
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 100;
      const skip: number = (query && query.skip) || 0;
      const userPopulate: any = {
        path: 'userId',
      };
      if (searchQuery.hasOwnProperty('country') && searchQuery.country) {
        userPopulate.match = {
          country: searchQuery.country,
        };
      }
      const cursor = this.liveStreamModel
        .find(searchQuery)
        .populate(userPopulate)
        .populate('categoryId')
        .limit(limit)
        .skip(skip);
      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }
      let res = await cursor.exec();
      res = res.filter((stream: any) => {
        const totalNumberOfAudience = stream.audiences.length;
        stream._doc.totalNumberOfAudience = totalNumberOfAudience;
        return stream.userId != null;
      });
      if (searchQuery && searchQuery.isEnd === false) {
        const runningLive = await this.liveKitService.listRoom();
        if (
          runningLive &&
          Array.isArray(runningLive) &&
          runningLive.length === 0
        ) {
          return runningLive;
        }
        const currentLive = [];
        runningLive.map((room) => {
          res &&
            res.map((live) => {
              if (live.roomName === room.name) {
                currentLive.push(live);
              }
            });
        });
        return currentLive;
      }
      return res;
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
