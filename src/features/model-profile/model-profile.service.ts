import {
  BadRequestException,
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
    console.log(files);
    const existModel = await this.findByUser(user?._id?.toString(), true);
    if (existModel)
      throw new BadRequestException('Model profile already exists');
    dto.userId = user?._id?.toString();
    dto.image = (await this.singleUpload(files.image)) as FileData;
    dto.video = (await this.singleUpload(files.video)) as FileData;
    const modelProfile = await this.modelProfileModel.create(dto);
    return await this.findById(modelProfile?._id?.toString());
  }

  async findAll() {
    return await this.modelProfileModel.find();
  }

  async findById(id: string, allowNull = false) {
    const modelProfile = await this.modelProfileModel.findById(id);
    if (!modelProfile && !allowNull)
      throw new NotFoundException('Model profile not found');
    return modelProfile;
  }

  async findByUser(userId: string, allowNull = false) {
    const modelProfile = await this.modelProfileModel.findOne({ userId });
    if (!modelProfile && !allowNull)
      throw new NotFoundException('Model profile not found');
    return modelProfile;
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

  async update(
    id: string,
    dto: UpdateModelProfileDto,
    user: IAuthUser,
    files: ModelProfileFiles,
  ) {
    const modelProfile = await this.findById(id);
    if (
      !(
        user?.role === ROLE.ADMIN ||
        user?.id?.toString() === modelProfile?.userId?.toString()
      )
    )
      throw new UnauthorizedException('unauthorise');

    if (files.image)
      dto.image = (await this.singleUpload(files.image)) as FileData;

    if (files.video)
      dto.video = (await this.singleUpload(files.video)) as FileData;
    await modelProfile.updateOne(dto);
    return await this.findById(id);
  }

  async remove(id: string, user: IAuthUser) {
    const modelProfile = await this.findById(id);
    if (
      !(
        user?.role === ROLE.ADMIN ||
        user?.id?.toString() === modelProfile?.userId?.toString()
      )
    )
      throw new UnauthorizedException('unauthorise');
    await modelProfile.remove();
    return modelProfile;
  }
}
