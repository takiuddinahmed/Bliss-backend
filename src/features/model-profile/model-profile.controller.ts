import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ModelProfileService } from './model-profile.service';
import {
  CreateModelProfileDto,
  UpdateModelProfileDto,
} from './model-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ModelProfileFiles } from './model-profile.model';
@ApiTags('Model Profile')
@ApiBearerAuth()
@Controller('model-profile')
export class ModelProfileController {
  constructor(private readonly modelProfileService: ModelProfileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  create(
    @Body() createModelProfileDto: CreateModelProfileDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: ModelProfileFiles,
  ) {
    return this.modelProfileService.create(createModelProfileDto, user, files);
  }

  @Get()
  findAll() {
    return this.modelProfileService.findAll();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async findByUser(@AuthUser() user: IAuthUser) {
    return await this.modelProfileService.findByUser(user?._id?.toString());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelProfileService.findById(id);
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
