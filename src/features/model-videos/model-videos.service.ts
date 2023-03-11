import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames, FileData } from '../common';
import { IAuthUser } from '../security';
import { SpaceService } from '../space/space.service';
import { CreateModelVideoDto, UpdateModelVideoDto } from './model-video.dto';
import { ModelVideoDocument, ModelVideoFiles } from './model-video.model';

@Injectable()
export class ModelVideosService {
  constructor(
    @InjectModel(collectionNames.modelVideos)
    private modelVideoModel: Model<ModelVideoDocument>,
    private spaceService: SpaceService,
  ) {}

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

  async create(
    dto: CreateModelVideoDto,
    user: IAuthUser,
    files?: ModelVideoFiles,
  ) {
    dto.userId = user?.id?.toString();
    dto.thumbnails = await this.multiUpload(files.thumbnails);
    dto.video = (await this.singleUpload(files.video)) as FileData;
    const modelVideo = await this.modelVideoModel.create(dto);
    return await this.findById(modelVideo?._id?.toString());
  }

  async findAll() {
    return this.modelVideoModel.find();
  }

  async findById(id: string) {
    return await this.modelVideoModel.findById(id);
  }

  // update(id: number, updateModelVideoDto: UpdateModelVideoDto) {
  //   return `This action updates a #${id} modelVideo`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} modelVideo`;
  // }
}
