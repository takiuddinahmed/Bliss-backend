import {
    Body,
    Controller, Delete, Get, Param, Patch, Post, UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../security';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

import { CategoryService } from './category.service';


@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryServicec: CategoryService
    ){}


    @Get()
    @UseGuards(JwtAuthGuard)
    async getAll() {
        return await this.categoryServicec.getCategories();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getCategory(@Param('id') id: string) {
        return await this.categoryServicec.getCategory(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return await this.categoryServicec.createCategory(createCategoryDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return await this.categoryServicec.updateCategory(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteCategory(
        @Param('id') id: string
    ) {
        return await this.categoryServicec.deleteCategory(id);
    }

    

}
