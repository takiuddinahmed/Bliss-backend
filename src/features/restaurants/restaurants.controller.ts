import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import { CreateRestaurantDto, UpdateRestaurantDto } from './restaurant.dto';
import { RestaurantFiles } from './restaurant.model';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
      { name: 'photoGallery', maxCount: 1 },
    ]),
  )
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: RestaurantFiles,
  ) {
    return this.restaurantsService.create(
      createRestaurantDto,
      user?._id?.toString(),
      files,
    );
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(+id);
  }
}
