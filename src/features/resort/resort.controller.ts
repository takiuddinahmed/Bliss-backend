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
import { JwtAuthGuard, RolesGuard } from '../security';
import { CreateResortDto, UpdateResortDto } from './resort-type.dto';
import { ResortService } from './resort-type.service';

@ApiTags('Resort')
@ApiBearerAuth()
@Controller('resort')
export class ResortController {
  constructor(private readonly ResortService: ResortService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createResortDto: CreateResortDto) {
    return this.ResortService.create(createResortDto);
  }

  @Get()
  findAll() {
    return this.ResortService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ResortService.getById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateResortDto: UpdateResortDto,
  ) {
    return this.ResortService.update(id, updateResortDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.ResortService.remove(id);
  }
}
