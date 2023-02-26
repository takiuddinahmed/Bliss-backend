import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAuthUser } from 'src/features/security';
import { collectionNames, FileData } from '../common';
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
  ) {}
  async create(form: CreateChannelDto, files: ChannelFiles, user: IAuthUser) {
    const channelFound = await this.channelModel.findOne({
      userId: user._id.toString(),
    });
    if (channelFound) {
      throw new BadRequestException('Channel already exist for this user');
    }
    form.logo = (await this.singleUpload(files.logo)) as FileData;
    form.banner = (await this.singleUpload(files.banner)) as FileData;
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
    form.logo = (await this.singleUpload(files.logo)) as FileData;
    form.banner = (await this.singleUpload(files.banner)) as FileData;
    return await this.channelModel.findOneAndUpdate(
      { permalik, userId },
      form,
      {
        new: true,
      },
    );
  }

  async subscribe(id: string, userId: string) {
    const channel = await this.findOne(id);
    if (channel?.subscribers?.some((uId) => uId.toString() === userId)) {
      return channel;
    } else {
      return await this.channelModel.findByIdAndUpdate(
        id,
        {
          $push: { subscribers: userId },
        },
        { new: true },
      );
    }
  }
  async unsubscribe(id: string, userId: string) {
    const channel = await this.findOne(id);
    if (channel?.subscribers?.some((uId) => uId.toString() === userId)) {
      return await this.channelModel.findByIdAndUpdate(
        id,
        {
          $pull: { subscribers: userId },
        },
        { new: true },
      );
    } else {
      return channel;
    }
  }

  async remove(id: string, userId: string) {
    const channel = await this.channelModel.findOne({ _id: id, userId });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    const deleteChanel = await this.channelModel.findOneAndDelete({
      _id: id,
      userId,
    });
    if (deleteChanel) {
      await this.userService.removeChannelFromUser(channel.userId.toString());
    }
    return deleteChanel;
  }

  async singleUpload(files: Express.Multer.File[]) {
    if (files?.length) {
      const fileData = await this.spaceService.uploadFile(files[0]);
      if (!fileData)
        throw new InternalServerErrorException('File upload failed');
      return fileData;
    }
    return {};
  }

  async multiUpload(files: Express.Multer.File[]) {
    const fileData: FileData[] = [];
    if (files?.length) {
      for (let i = 0; i < files.length; i++) {
        const uploadedFile = await this.spaceService.uploadFile(files[i]);
        if (!uploadedFile)
          throw new InternalServerErrorException('File upload failed');
        fileData[i] = uploadedFile;
      }
    }
    return fileData;
  }

  async migrate() {
    await this.channelModel.deleteMany({ userId: undefined });
  }
}
