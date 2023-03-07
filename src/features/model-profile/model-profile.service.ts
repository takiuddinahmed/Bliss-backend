import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames, FileData } from '../common';
import { IAuthUser } from '../security';
import { SpaceService } from '../space/space.service';
import {
  CreateModelProfileDto,
  UpdateModelProfileDto,
} from './model-profile.dto';
import { ModelProfileDocument, ModelProfileFiles } from './model-profile.model';
@Injectable()
export class ModelProfileService {
  constructor(
    @InjectModel(collectionNames.modelProfile)
    private modelProfileModel: Model<ModelProfileDocument>,
    private spaceService: SpaceService,
  ) {}
  async create(
    dto: CreateModelProfileDto,
    user: IAuthUser,
    files?: ModelProfileFiles,
  ) {
    dto.userId = user?._id?.toString();
    dto.image = (await this.singleUpload(files.image)) as FileData;
    dto.video = (await this.singleUpload(files.video)) as FileData;
    const newsfeed = await this.modelProfileModel.create(dto);
    return await this.findById(newsfeed?._id?.toString());
  }

  async findAll() {
    return await this.modelProfileModel.find();
  }

  async findById(id: string) {
    const modelGallery = await this.modelProfileModel.findById(id);
    if (!modelGallery) throw new NotFoundException('Model gallery not found');
    return modelGallery;
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

  update(id: number, updateModelProfileDto: UpdateModelProfileDto) {
    return `This action updates a #${id} modelProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} modelProfile`;
  }
}
