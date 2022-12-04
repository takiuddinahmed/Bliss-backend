import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import {
  CreateRestaurantBookingDto,
  UpdateRestaurantBookingDto,
} from './restaurant-booking.dto';
import { RestaurantBookingService } from './restaurant-booking.service';

@ApiTags('Restaurant Booking')
@ApiBearerAuth()
@Controller('restaurant-booking')
export class RestaurantBookingController {
  constructor(
    private readonly restaurantBookingService: RestaurantBookingService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateRestaurantBookingDto, @AuthUser() user: IAuthUser) {
    dto.userId = user._id.toString();
    return this.restaurantBookingService.create(dto);
  }

  @Get()
  findAll() {
    return this.restaurantBookingService.findAll();
  }

  @Get('restaurant/:restaurantId')
  findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.restaurantBookingService.findByRestaurant(restaurantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findByUser(@AuthUser() user: IAuthUser) {
    return this.restaurantBookingService.findByUser(user?._id?.toString());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantBookingService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantBookingDto,
    @AuthUser() user: IAuthUser,
  ) {
    return this.restaurantBookingService.update(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return this.restaurantBookingService.remove(id, user);
  }
}
