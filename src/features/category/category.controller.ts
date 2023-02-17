import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from '../security';
import { ROLE } from '../user/user.model';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

import { CategoryService } from './category.service';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll() {
    return await this.categoryService.getCategories();
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    return await this.categoryService.getCategory(id);
  }

  @Get('permalink/:permalink')
  async getCategoryByPermalink(@Param('permalink') permalink: string) {
    return await this.categoryService.getCategoryByPermalink(permalink);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile('image') image?: Express.Multer.File,
  ) {
    return await this.categoryService.createCategory(createCategoryDto, image);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile('image') image?: Express.Multer.File,
  ) {
    return await this.categoryService.updateCategory(
      id,
      updateCategoryDto,
      image,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async deleteCategory(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
