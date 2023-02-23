import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ModelGalleryService } from './model-gallery.service';
import {
  CreateModelGalleryDto,
  UpdateModelGalleryDto,
} from './model-gallery.dto';
@Controller('model-gallery')
export class ModelGalleryController {
  constructor(private readonly modelGalleryService: ModelGalleryService) {}

  @Post()
  create(@Body() createModelGalleryDto: CreateModelGalleryDto) {
    return this.modelGalleryService.create(createModelGalleryDto);
  }

  @Get()
  findAll() {
    return this.modelGalleryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelGalleryService.findOne(+id);
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
