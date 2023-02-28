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
import { ModelGalleryService } from './model-gallery.service';
import {
  CreateModelGalleryDto,
  UpdateModelGalleryDto,
} from './model-gallery.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import { ModelGalleryFiles } from './model-gallery.model';

@ApiTags('Model Gallery')
@ApiBearerAuth()
@Controller('model-gallery')
export class ModelGalleryController {
  constructor(private readonly modelGalleryService: ModelGalleryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'basicImages[]', maxCount: 3 },
      { name: 'specialImages[]', maxCount: 10 },
      { name: 'archiveImages[]', maxCount: 10 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  create(
    @Body() dto: CreateModelGalleryDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: ModelGalleryFiles,
  ) {
    return this.modelGalleryService.create(dto, user, files);
  }

  @Get()
  findAll() {
    return this.modelGalleryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelGalleryService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModelGalleryDto: UpdateModelGalleryDto,
  ) {
    return this.modelGalleryService.update(+id, updateModelGalleryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modelGalleryService.remove(+id);
  }
}
