import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import {
  CreateRestaurantCategoryDto,
  UpdateRestaurantCategoryDto,
} from './restaurant-category.dto';
import { RestaurantCategoryService } from './restaurant-category.service';

@ApiTags('Restaurant Category')
@ApiBearerAuth()
@Controller('restaurant-category')
export class RestaurantCategoryController {
  constructor(
    private readonly restaurantCategoryService: RestaurantCategoryService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() dto: CreateRestaurantCategoryDto,
    @UploadedFile() image: Express.Multer.File,
    @AuthUser() user: IAuthUser,
  ) {
    dto.userId = user?._id?.toString();
    return this.restaurantCategoryService.create(dto, image);
  }

  @Get()
  findAll() {
    return this.restaurantCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantCategoryService.findOne(id);
  }

  @Get('permalink/:permalink')
  findByPermalink(@Param('permalink') permalink: string) {
    return this.restaurantCategoryService.findByPermalink(permalink);
  }

  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantCategoryDto,
    @UploadedFile() image: Express.Multer.File,
    @AuthUser() user: IAuthUser,
  ) {
    dto.userId = user?._id?.toString();
    return this.restaurantCategoryService.update(id, dto, image);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantCategoryService.remove(id);
  }
}
