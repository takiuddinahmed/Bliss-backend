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
  Put,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { LikeDislikeEnum } from '../common/enum/likeDislike.enum';
import { CreateRatingReviewDto } from '../common/models/ratingReview.model';
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
      { name: 'thumbnails', maxCount: 10 },
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

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'thumbnails', maxCount: 10 },
      { name: 'videos', maxCount: 5 },
    ]),
  )
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantMenuDto,
    @UploadedFiles() files: RestaurantMenuFiles,
    @AuthUser() user: IAuthUser,
  ) {
    return this.restaurantMenuService.update(id, dto, user, files);
  }

  @Put('ratingReview/:id')
  @UseGuards(JwtAuthGuard)
  async ratingReview(
    @Param('id') id: string,
    @Body() dto: CreateRatingReviewDto,
    @AuthUser() user: IAuthUser,
  ) {
    return await this.restaurantMenuService.addRatingReview(
      id,
      user?._id?.toString(),
      dto,
    );
  }

  @ApiParam({ name: 'likeDislike', enum: LikeDislikeEnum })
  @Put('/like-dislike/:id/:likeDislike')
  @UseGuards(JwtAuthGuard)
  async likeComment(
    @Param('id') id: string,
    @Param('likeDislike') likeDislike: LikeDislikeEnum,
    @AuthUser() user: IAuthUser,
  ) {
    return this.restaurantMenuService.likeDislikeContent(
      id,
      user._id.toString(),
      likeDislike,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantMenuService.remove(id);
  }
}
