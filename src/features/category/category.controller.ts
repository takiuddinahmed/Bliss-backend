import {
    Body,
    Controller, Delete, Get, Param, Patch, Post, UseGuards
} from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesGuard } from '../security';
import { ROLE } from '../user/user.model';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

import { CategoryService } from './category.service';


@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryServicec: CategoryService
    ){}

    @Get()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(ROLE.ADMIN)
    async getAll() {
        return await this.categoryServicec.getCategories();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(ROLE.ADMIN)
    async getCategory(@Param('id') id: string) {
        return await this.categoryServicec.getCategory(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return await this.categoryServicec.createCategory(createCategoryDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(ROLE.ADMIN)
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return await this.categoryServicec.updateCategory(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(ROLE.ADMIN)
    async deleteCategory(
        @Param('id') id: string
    ) {
        return await this.categoryServicec.deleteCategory(id);
    }

}
