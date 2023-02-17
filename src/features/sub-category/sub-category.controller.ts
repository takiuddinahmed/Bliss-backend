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
import { ROLE } from '../common/enum/user-role.enum';
import { JwtAuthGuard, Roles } from '../security';
import { RolesGuard } from '../security/roles.guard';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './sub-category.dto';
import { SubCategoryService } from './sub-category.service';

@ApiTags('Sub Category')
@ApiBearerAuth()
@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subcategoryService: SubCategoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async findAll() {
    return await this.subcategoryService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createSubcategoryDto: CreateSubCategoryDto,
    @UploadedFile('image') image?: Express.Multer.File,
  ) {
    return await this.subcategoryService.create(createSubcategoryDto, image);
  }

  @Get('find-by-category:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async findByCategory(@Param('id') id: string) {
    return await this.subcategoryService.findByCategory(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.subcategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubCategoryDto,
    @UploadedFile('image') image?: Express.Multer.File,
  ) {
    return await this.subcategoryService.update(
      id,
      updateSubcategoryDto,
      image,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async deleteCategory(@Param('id') id: string) {
    return await this.subcategoryService.remove(id);
  }
}
