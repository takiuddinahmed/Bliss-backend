import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generatePermalink } from '../utils';
import { Channel } from './channel.model';
import { CreateChannelInput } from './dto/create-channel.input';
import { UpdateChannelInput } from './dto/update-channel.input';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<Channel>,
  ) {}
  async create(input: CreateChannelInput) {
    input.permalink = await generatePermalink(input.name, this.channelModel);
    return this.channelModel.create(input);
  }

  findAll() {
    return this.channelModel.find();
  }

  async findOne(permalink: string) {
    const channel = await this.channelModel.findOne({ permalink });
    if (!channel) {
      throw new Error('Channel not found');
    }
    return channel;
  }

  async update(id: string, input: UpdateChannelInput) {
    const channel = await this.channelModel.findById(id);
    if (!channel) {
      throw new Error('Channel not found');
    }
    return await this.channelModel.findByIdAndUpdate(id, input, { new: true });
  }

  async remove(id: string) {
    const channel = await this.channelModel.findById(id);
    if (!channel) {
      throw new Error('Channel not found');
    }
    return this.channelModel.findByIdAndDelete(id);
  }
}
