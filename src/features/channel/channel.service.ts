import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAuthUser } from 'src/features/security';
import { collectionNames } from '../common';
import { SpaceService } from '../space/space.service';
import { UserService } from '../user';
import { generatePermalink } from '../utils';
import { Channel, ChannelFiles } from './channel.model';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(collectionNames.channel) private channelModel: Model<Channel>,
    private userService: UserService,
    private spaceService: SpaceService,
  ) {
    // this.migrate();
  }
  async create(form: CreateChannelDto, files: ChannelFiles, user: IAuthUser) {
    const channelFound = await this.channelModel.findOne({
      userId: user._id.toString(),
    });
    console.log('channelFound', channelFound);
    console.log('user', user);
    if (channelFound) {
      throw new BadRequestException('Channel already exist for this user');
    }
    if (files?.logo?.length) {
      const logo = await this.spaceService.uploadFile(files.logo[0]);
      if (logo) {
        form.logo = logo;
      } else throw new InternalServerErrorException('Logo upload failed');
    }
    if (files?.banner?.length) {
      const banner = await this.spaceService.uploadFile(files.banner[0]);
      if (banner) {
        form.banner = banner;
      } else throw new InternalServerErrorException('Banner upload failed');
    }
    form.permalink = await generatePermalink(form.name, this.channelModel);
    const channel = await this.channelModel.create(form);
    this.userService.addChannelToUser(
      form.userId.toString(),
      channel._id.toString(),
    );
    return channel;
  }

  findAll() {
    return this.channelModel.find();
  }

  async findOne(id: string) {
    console.log('id is', id);
    const channel = await this.channelModel.findById(id);
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    return channel;
  }
  async findByPermalink(permalink: string) {
    console.log('permalink is', permalink);
    const channel = await this.channelModel.findOne({ permalink });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    return channel;
  }

  async update(
    permalik: string,
    form: UpdateChannelDto,
    userId: string,
    files: ChannelFiles,
  ) {
    const channel = await this.channelModel.findOne({ permalik, userId });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    if (files?.logo?.length) {
      const logo = await this.spaceService.uploadFile(files.logo[0]);
      if (logo) {
        form.logo = logo;
      } else throw new InternalServerErrorException('Logo upload failed');
    }
    if (files?.banner?.length) {
      const banner = await this.spaceService.uploadFile(files.banner[0]);
      if (banner) {
        form.banner = banner;
      } else throw new InternalServerErrorException('Banner upload failed');
    }
    return await this.channelModel.findOneAndUpdate(
      { permalik, userId },
      form,
      {
        new: true,
      },
    );
  }

  async remove(id: string, userId: string) {
    const channel = await this.channelModel.findOne({ _id: id, userId });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    return this.channelModel.findOneAndDelete({ _id: id, userId });
  }

  async migrate() {
    await this.channelModel.deleteMany({ userId: undefined });
  }
}
