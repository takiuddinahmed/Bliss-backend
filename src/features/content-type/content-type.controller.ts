import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ROLE } from '../common/user-role.enum';
import { JwtAuthGuard, Roles, RolesGuard } from '../security';
import { CreateContentTypeDto, UpdateContentTypeDto } from './content-type.dto';
import { ContentTypeService } from './content-type.service';

@Controller('content-type')
export class ContentTypeController {
    constructor(
        private readonly contentTypeService: ContentTypeService
    ){}
    

    @Post()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(ROLE.ADMIN)
    async create(@Body() createContentTypeDto: CreateContentTypeDto) {
        return await this.contentTypeService.create(createContentTypeDto);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(ROLE.ADMIN)
    async findOne(@Param('id') id: string) {
        return await this.contentTypeService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(ROLE.ADMIN)
    async update(
        @Param('id') id: string,
        @Body() updateContentTypeDto: UpdateContentTypeDto,
    ) {
        return await this.contentTypeService.update(id, updateContentTypeDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(ROLE.ADMIN)
    async remove(
        @Param('id') id: string
    ) {
        return await this.contentTypeService.remove(id);
    }

    
}
