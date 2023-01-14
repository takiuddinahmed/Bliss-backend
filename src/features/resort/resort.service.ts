import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames, FileData } from '../common';
import { SpaceService } from '../space/space.service';
import { generatePermalink } from '../utils';
import { CreateResortDto, UpdateResortDto } from './resort.dto';
import {
  ResortDocument,
  ResortDocumentWithId,
  ResortFiles,
} from './resort.model';

@Injectable()
export class ResortService {
  constructor(
    @InjectModel(collectionNames.resort)
    private ResortModel: Model<ResortDocumentWithId>,
    private spaceService: SpaceService,
  ) {}
  async create(dto: CreateResortDto, files: ResortFiles) {
    dto.permalink = await generatePermalink(dto.name, this.ResortModel);

    dto.banner = (await this.singleUpload(files.banner)) as FileData;
    dto.images = await this.multiUpload(files.images);
    dto.videos = await this.multiUpload(files.videos);
    dto.packageImages = await this.multiUpload(files.packageImages);
    return await this.ResortModel.create(dto);
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

  async getAll() {
    return await this.ResortModel.find();
  }

  async getById(id: string, allowNull = false) {
    const Resort = await this.ResortModel.findById(id);
    if (!Resort && !allowNull) {
      throw new NotFoundException('Resort not found');
    }
    return Resort;
  }

  async update(id: string, dto: UpdateResortDto) {
    const Resort = await this.getById(id);
    await Resort.updateOne(dto);
    return await this.getById(id);
  }

  async remove(id: string) {
    const Resort = await this.getById(id);
    await Resort.remove();
    return Resort;
  }
}
