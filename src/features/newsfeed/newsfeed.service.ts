import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames, FileData } from '../common';
import { IAuthUser } from '../security';
import { SpaceService } from '../space/space.service';
import { ROLE } from '../user/user.model';
import { CreateNewsfeedDto, UpdateNewsfeedDto } from './newsfeed.dto';
import { NewsfeedDocument, NewsfeedFiles } from './newsfeed.model';

@Injectable()
export class NewsfeedService {
  constructor(
    @InjectModel(collectionNames.newsfeed)
    private newsfeedModel: Model<NewsfeedDocument>,
    private spaceService: SpaceService,
  ) {}

  async create(dto: CreateNewsfeedDto, user: IAuthUser, files?: NewsfeedFiles) {
    dto.userId = user?._id?.toString();
    dto.files = await this.multiUpload(files?.files);
    dto.thumbnails = await this.multiUpload(files?.thumbnails);
    const newsfeed = await this.newsfeedModel.create(dto);
    return await this.newsfeedModel.findById(newsfeed?._id);
  }

  async findAll() {
    return await this.newsfeedModel.find();
  }

  async findById(id: string) {
    const newsfeed = await this.newsfeedModel.findById(id);
    if (!newsfeed) throw new NotFoundException('Newsfeed not found');
    return newsfeed;
  }

  async findByPermalink(permalink: string) {
    const newsfeed = await this.newsfeedModel.findOne({ permalink });
    if (!newsfeed) throw new NotFoundException('Newsfeed not found');
    return newsfeed;
  }

  async update(
    id: string,
    dto: UpdateNewsfeedDto,
    user: IAuthUser,
    files?: NewsfeedFiles,
  ) {
    const newsfeed = await this.findById(id);
    if (
      user?.role !== ROLE.ADMIN ||
      user?.id?.toString() !== newsfeed?.userId?.toString()
    )
      throw new UnauthorizedException('unauthorise');
    dto.files = [...newsfeed.files, ...(await this.multiUpload(files.files))];
    dto.thumbnails = [
      ...newsfeed.thumbnails,
      ...(await this.multiUpload(files.thumbnails)),
    ];
    await newsfeed.updateOne(dto);
    return await this.findById(id);
  }

  async remove(id: string, user: IAuthUser) {
    const newsfeed = await this.findById(id);
    if (
      user?.role !== ROLE.ADMIN ||
      user?.id?.toString() !== newsfeed?.userId?.toString()
    )
      throw new UnauthorizedException('unauthorise');
    await newsfeed.remove();
    return newsfeed;
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
}
