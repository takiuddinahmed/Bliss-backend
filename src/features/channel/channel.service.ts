import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { UserService } from '../user';
import { generatePermalink } from '../utils';
import { Channel } from './channel.model';
import { CreateChannelInput } from './dto/create-channel.input';
import { UpdateChannelInput } from './dto/update-channel.input';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(collectionNames.channel) private channelModel: Model<Channel>,
    private userService: UserService,
  ) {
    // this.migrate();
  }
  async create(input: CreateChannelInput) {
    const channelFound = await this.channelModel.findOne({
      userId: input.userId,
    });
    if (channelFound) {
      throw new Error('Channel already exist for this user');
    }
    input.permalink = await generatePermalink(input.name, this.channelModel);
    const channel = await this.channelModel.create(input);
    this.userService.addChannelToUser(input.userId, channel._id.toString());
  }

  findAll() {
    return this.channelModel.find().populate('user');
  }

  async findOne(permalink: string) {
    const channel = await this.channelModel
      .findOne({ permalink })
      .populate('user');
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

  async migrate() {
    await this.channelModel.deleteMany({ userId: undefined });
  }
}
