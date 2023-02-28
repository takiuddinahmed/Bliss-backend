import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames, FileData } from '../common';
import { IAuthUser } from '../security';
import { SpaceService } from '../space/space.service';
import {
  CreateModelGalleryDto,
  UpdateModelGalleryDto,
} from './model-gallery.dto';
import { ModelGalleryDocument, ModelGalleryFiles } from './model-gallery.model';
@Injectable()
export class ModelGalleryService {
  constructor(
    @InjectModel(collectionNames.modelGallery)
    private modelGalleryModel: Model<ModelGalleryDocument>,
    private spaceService: SpaceService,
  ) {}
  async create(
    dto: CreateModelGalleryDto,
    user: IAuthUser,
    files?: ModelGalleryFiles,
  ) {
    dto.userId = user?._id?.toString();
    dto.basicImages = await this.multiUpload(files['basicImages[]']);
    dto.specialImages = await this.multiUpload(files['specialImages[]']);
    dto.archiveImages = await this.multiUpload(files['specialImages[]']);
    dto.video = (await this.singleUpload(files['video'])) as FileData;
    const newsfeed = await this.modelGalleryModel.create(dto);
    return await this.findById(newsfeed?._id?.toString());
  }

  async findAll() {
    return await this.modelGalleryModel.find();
  }

  async findById(id: string) {
    const modelGallery = await this.modelGalleryModel.findById(id);
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

  update(id: number, updateModelGalleryDto: UpdateModelGalleryDto) {
    return `This action updates a #${id} modelGallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} modelGallery`;
  }
}
