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
  CreateCouncilorAppoinmentDto,
  UpdateCouncilorAppoinmentDto,
} from './councilor-appoinment.dto';
import { CouncilorAppoinmentService } from './councilor-appoinment.service';

@ApiTags('Councilor Appoinment')
@ApiBearerAuth()
@Controller('councilor-apoinment')
export class CouncilorAppoinmentController {
  constructor(
    private readonly councilorAppoinmentService: CouncilorAppoinmentService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateCouncilorAppoinmentDto,
    @AuthUser() user: IAuthUser,
  ) {
    dto.userId = user._id.toString();
    return this.councilorAppoinmentService.create(dto);
  }

  @Get()
  findAll() {
    return this.councilorAppoinmentService.findAll();
  }

  @Get('councilor/:councilorId')
  findByRestaurant(@Param('councilorId') councilorId: string) {
    return this.councilorAppoinmentService.findByCouncilor(councilorId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findByUser(@AuthUser() user: IAuthUser) {
    return this.councilorAppoinmentService.findByUser(user?._id?.toString());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.councilorAppoinmentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCouncilorAppoinmentDto,
    @AuthUser() user: IAuthUser,
  ) {
    return this.councilorAppoinmentService.update(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return this.councilorAppoinmentService.remove(id, user);
  }
}
