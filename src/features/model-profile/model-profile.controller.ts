import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ModelProfileService } from './model-profile.service';
import {
  CreateModelProfileDto,
  UpdateModelProfileDto,
} from './model-profile.dto';
@Controller('model-profile')
export class ModelProfileController {
  constructor(private readonly modelProfileService: ModelProfileService) {}

  @Post()
  create(@Body() createModelProfileDto: CreateModelProfileDto) {
    return this.modelProfileService.create(createModelProfileDto);
  }

  @Get()
  findAll() {
    return this.modelProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelProfileService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModelProfileDto: UpdateModelProfileDto,
  ) {
    return this.modelProfileService.update(+id, updateModelProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modelProfileService.remove(+id);
  }
}
