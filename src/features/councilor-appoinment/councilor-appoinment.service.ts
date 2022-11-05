import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { IAuthUser, Roles } from '../security';
import { ROLE } from '../user/user.model';
import {
  CreateCouncilorAppoinmentDto,
  UpdateCouncilorAppoinmentDto,
} from './councilor-appoinment.dto';
import { CouncilorAppoinmentDocument } from './councilor-appoinment.model';

@Injectable()
export class CouncilorAppoinmentService {
  constructor(
    @InjectModel(collectionNames.councilorAppoinment)
    private councilorAppoinmentModel: Model<CouncilorAppoinmentDocument>,
  ) {}

  async create(dto: CreateCouncilorAppoinmentDto) {
    return await this.councilorAppoinmentModel.create(dto);
  }

  async findAll() {
    return await this.councilorAppoinmentModel.find();
  }

  async findByCouncilor(councilorId: string) {
    return await this.councilorAppoinmentModel.find({
      councilorId: councilorId,
    });
  }

  async findOne(id: string) {
    const councilorAppoinment = await this.councilorAppoinmentModel.findById(
      id,
    );
    if (!councilorAppoinment)
      throw new NotFoundException('Appoinment not found');
    return councilorAppoinment;
  }

  async update(id: string, dto: UpdateCouncilorAppoinmentDto, user: IAuthUser) {
    const councilorAppoinment = await this.findOne(id);
    if (
      !(
        user.role === ROLE.ADMIN ||
        user?._id?.toString() === councilorAppoinment.userId.toString()
      )
    )
      throw new ForbiddenException('User has no permission');
    return await this.councilorAppoinmentModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  async remove(id: string, user: IAuthUser) {
    const councilorAppoinment = await this.findOne(id);
    if (
      !(
        user.role === ROLE.ADMIN ||
        user?._id?.toString() === councilorAppoinment.userId.toString()
      )
    )
      throw new ForbiddenException('User has no permission');
    return this.councilorAppoinmentModel.findByIdAndDelete(id);
  }
}
