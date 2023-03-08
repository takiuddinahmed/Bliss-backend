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
import { ModelCategoryService } from './model-category.service';
import {
  CreateModelCategoryDto,
  UpdateModelCategoryDto,
} from './create-model-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from '../security';
import { ROLE } from '../user/user.model';

@ApiTags('Model Category')
@ApiBearerAuth()
@Controller('model-category')
export class ModelCategoryController {
  constructor(private readonly modelCategoryService: ModelCategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  create(@Body() dto: CreateModelCategoryDto) {
    return this.modelCategoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.modelCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelCategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateModelCategoryDto: UpdateModelCategoryDto,
  ) {
    return this.modelCategoryService.update(id, updateModelCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modelCategoryService.remove(id);
  }
}
