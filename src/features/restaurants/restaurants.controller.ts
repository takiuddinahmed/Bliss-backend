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
  Put,
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
    @Body() dto: CreateRestaurantDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: RestaurantFiles,
  ) {
    dto.userId = user?._id?.toString();
    return this.restaurantsService.create(dto, files);
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Get('permalink/:permalink')
  async findByPermalink(@Param('permalink') permalink: string) {
    return await this.restaurantsService.findByPermalink(permalink);
  }

  @Put('follow/:id')
  @UseGuards(JwtAuthGuard)
  async follow(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return await this.restaurantsService.follow(id, user?._id?.toString());
  }
  @Put('unfollow/:id')
  @UseGuards(JwtAuthGuard)
  async unfollow(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return await this.restaurantsService.unfollow(id, user?._id?.toString());
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
      { name: 'photoGallery', maxCount: 1 },
    ]),
  )
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: RestaurantFiles,
  ) {
    return this.restaurantsService.update(id, dto, user, files);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.restaurantsService.remove(id);
  }
}
