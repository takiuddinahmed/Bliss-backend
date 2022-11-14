import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import {
  CreateRestaurantMenuDto,
  UpdateRestaurantMenuDto,
} from './restaurant-menu.dto';
import { RestaurantMenuFiles } from './restaurant-menu.model';
import { RestaurantMenuService } from './restaurant-menu.service';
@ApiTags('Restaurant Menu')
@ApiBearerAuth()
@Controller('restaurant-menu')
export class RestaurantMenuController {
  constructor(private readonly restaurantMenuService: RestaurantMenuService) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'thumnails', maxCount: 10 },
      { name: 'videos', maxCount: 5 },
    ]),
  )
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateRestaurantMenuDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: RestaurantMenuFiles,
  ) {
    dto.userId = user?._id?.toString();
    return this.restaurantMenuService.create(dto, files);
  }

  @Get()
  findAll() {
    return this.restaurantMenuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantMenuService.findOne(id);
  }

  @Get('permalink/:permalink')
  findOneByPermalink(@Param('permalink') permalink: string) {
    return this.restaurantMenuService.findOneByPermalink(permalink);
  }

  @Get('restaurant/:restaurantId')
  findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.restaurantMenuService.findByRestaurant(restaurantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantMenuDto: UpdateRestaurantMenuDto,
  ) {
    return this.restaurantMenuService.update(id, updateRestaurantMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantMenuService.remove(id);
  }
}
