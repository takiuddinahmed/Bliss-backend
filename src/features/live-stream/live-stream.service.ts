import { Injectable } from '@nestjs/common';
import { CreateLiveStreamDto } from './dto/create-live-stream.dto';
import { UpdateLiveStreamDto } from './dto/update-live-stream.dto';

@Injectable()
export class LiveStreamService {
  create(createLiveStreamDto: CreateLiveStreamDto) {
    return 'This action adds a new liveStream';
  }

  findAll() {
    return `This action returns all liveStream`;
  }

  findOne(id: number) {
    return `This action returns a #${id} liveStream`;
  }

  update(id: number, updateLiveStreamDto: UpdateLiveStreamDto) {
    return `This action updates a #${id} liveStream`;
  }

  remove(id: number) {
    return `This action removes a #${id} liveStream`;
  }
}
