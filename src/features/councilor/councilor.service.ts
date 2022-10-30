import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames } from '../common';
import { IAuthUser } from '../security';
import { CreateCouncilorDto } from './councilor.dto';
import { CouncilorDocument } from './councilor.model';

@Injectable()
export class CouncilorService {
  constructor(
    @InjectModel(collectionNames.councilor)
    private councilorModel: Model<CouncilorDocument>,
  ) {}

  // create coouncilor
  async createCouncilor(
    user: IAuthUser,
    createCouncilorDto: CreateCouncilorDto,
  ) {
    const cheeckCouncilor = await this.councilorModel.findOne({
      userId: user._id,
    });
    if (cheeckCouncilor) {
      throw new BadRequestException('You already have a councilor form');
    }
    return this.councilorModel.create({
      ...createCouncilorDto,
      userId: user._id,
    });
  }
}
