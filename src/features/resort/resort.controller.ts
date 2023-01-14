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
import { AuthUser, IAuthUser, JwtAuthGuard, RolesGuard } from '../security';
import { CreateResortDto, UpdateResortDto } from './resort.dto';
import { ResortFiles } from './resort.model';
import { ResortService } from './resort.service';

@ApiTags('Resort')
@ApiBearerAuth()
@Controller('resort')
export class ResortController {
  constructor(private readonly ResortService: ResortService) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'videos', maxCount: 10 },
      { name: 'banner', maxCount: 1 },
      { name: 'packageImages', maxCount: 10 },
    ]),
  )
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(
    @Body() dto: CreateResortDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: ResortFiles,
  ) {
    dto.userId = user?._id?.toString();
    return this.ResortService.create(dto, files);
  }

  @Get()
  findAll() {
    return this.ResortService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ResortService.getById(id);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'videos', maxCount: 10 },
      { name: 'banner', maxCount: 1 },
      { name: 'packageImages', maxCount: 10 },
    ]),
  )
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateResortDto: UpdateResortDto) {
    return this.ResortService.update(id, updateResortDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.ResortService.remove(id);
  }
}
