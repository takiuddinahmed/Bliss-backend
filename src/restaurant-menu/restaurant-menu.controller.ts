import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  CreateRestaurantMenuDto,
  UpdateRestaurantMenuDto,
} from './restaurant-menu.dto';
import { RestaurantMenuService } from './restaurant-menu.service';

@Controller('restaurant-menu')
export class RestaurantMenuController {
  constructor(private readonly restaurantMenuService: RestaurantMenuService) {}

  @Post()
  create(@Body() createRestaurantMenuDto: CreateRestaurantMenuDto) {
    return this.restaurantMenuService.create(createRestaurantMenuDto);
  }

  @Get()
  findAll() {
    return this.restaurantMenuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantMenuService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantMenuDto: UpdateRestaurantMenuDto,
  ) {
    return this.restaurantMenuService.update(+id, updateRestaurantMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantMenuService.remove(+id);
  }
}
