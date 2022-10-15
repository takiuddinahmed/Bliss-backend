import {
    Body,
    Controller, Delete, Get, Param, Patch, Post, UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../security';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './sub-category.dto';
import { SubCategoryService } from './sub-category.service';

@Controller('sub-category')
export class SubCategoryController {
    constructor(
        private readonly subcategoryService: SubCategoryService
    ){}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
        return await this.subcategoryService.findAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createSubcategoryDto: CreateSubCategoryDto) {
        return await this.subcategoryService.create(createSubcategoryDto);
    }

    @Get('find-by-category:id')
    @UseGuards(JwtAuthGuard)
    async findByCategory(@Param('id') id: string) {
        return await this.subcategoryService.findByCategory(id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string) {
        return await this.subcategoryService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateSubcategoryDto: UpdateSubCategoryDto,
    ) {
        return await this.subcategoryService.update(id, updateSubcategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteCategory(
        @Param('id') id: string
    ) {
        return await this.subcategoryService.remove(id);
    }

}