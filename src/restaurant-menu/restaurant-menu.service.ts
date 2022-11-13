import { Injectable } from '@nestjs/common';
import {
  CreateRestaurantMenuDto,
  UpdateRestaurantMenuDto,
} from './restaurant-menu.dto';

@Injectable()
export class RestaurantMenuService {
  create(createRestaurantMenuDto: CreateRestaurantMenuDto) {
    return 'This action adds a new restaurantMenu';
  }

  findAll() {
    return `This action returns all restaurantMenu`;
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurantMenu`;
  }

  update(id: number, updateRestaurantMenuDto: UpdateRestaurantMenuDto) {
    return `This action updates a #${id} restaurantMenu`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurantMenu`;
  }
}
