import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ModelPictureService } from './model-picture.service';
import { CreateModelPictureDto } from './create-model-picture.dto';
import { UpdateModelPictureDto } from './dto/update-model-picture.dto';

@Controller('model-picture')
export class ModelPictureController {
  constructor(private readonly modelPictureService: ModelPictureService) {}

  @Post()
  create(@Body() createModelPictureDto: CreateModelPictureDto) {
    return this.modelPictureService.create(createModelPictureDto);
  }

  @Get()
  findAll() {
    return this.modelPictureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelPictureService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModelPictureDto: UpdateModelPictureDto,
  ) {
    return this.modelPictureService.update(+id, updateModelPictureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modelPictureService.remove(+id);
  }
}
