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
  CreateRestaurantBookingDto,
  UpdateRestaurantBookingDto,
} from './restaurant-booking.dto';
import { RestaurantBookingDocument } from './restaurant-booking.model';

@Injectable()
export class RestaurantBookingService {
  constructor(
    @InjectModel(collectionNames.restaurantBooking)
    private restaurantBookingModel: Model<RestaurantBookingDocument>,
  ) {}

  async create(dto: CreateRestaurantBookingDto) {
    return await this.restaurantBookingModel.create(dto);
  }

  async findAll() {
    return await this.restaurantBookingModel.find();
  }

  async findByRestaurant(restaurantId: string) {
    return await this.restaurantBookingModel.find({ restaurantId });
  }

  async findByUser(userId: string) {
    return (
      await this.restaurantBookingModel
        .find({ userId })
        .populate('restaurantId')
    ).filter((d) => d.restaurantId);
  }

  async findOne(id: string) {
    const restaurantBooking = await this.restaurantBookingModel.findById(id);
    if (!restaurantBooking) throw new NotFoundException('Restaurant not found');
    return restaurantBooking;
  }

  async update(id: string, dto: UpdateRestaurantBookingDto, user: IAuthUser) {
    const restaurantBooking = await this.findOne(id);
    if (
      !(
        user.role === ROLE.ADMIN ||
        user?._id?.toString() === restaurantBooking.userId.toString()
      )
    )
      throw new ForbiddenException('User has no permission');
    return await this.restaurantBookingModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  async remove(id: string, user: IAuthUser) {
    const restaurantBooking = await this.findOne(id);
    if (
      !(
        user.role === ROLE.ADMIN ||
        user?._id?.toString() === restaurantBooking.userId.toString()
      )
    )
      throw new ForbiddenException('User has no permission');
    return this.restaurantBookingModel.findByIdAndDelete(id);
  }
}
