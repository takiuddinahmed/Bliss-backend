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
import { JwtAuthGuard, Roles, RolesGuard } from '../security';
import { ROLE } from '../user/user.model';
import { CreateResortTypeDto, UpdateResortTypeDto } from './resort-type.dto';
import { ResortTypeService } from './resort-type.service';

@ApiTags('Resort Type')
@ApiBearerAuth()
@Controller('resort-type')
export class ResortTypeController {
  constructor(private readonly resortTypeService: ResortTypeService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  create(@Body() createResortTypeDto: CreateResortTypeDto) {
    return this.resortTypeService.create(createResortTypeDto);
  }

  @Get()
  findAll() {
    return this.resortTypeService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.resortTypeService.getById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateResortTypeDto: UpdateResortTypeDto,
  ) {
    return this.resortTypeService.update(id, updateResortTypeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  remove(@Param('id') id: string) {
    return this.resortTypeService.remove(id);
  }
}
