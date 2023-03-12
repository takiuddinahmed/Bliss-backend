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
import { ModelVideosService } from './model-videos.service';
import { CreateModelVideoDto, UpdateModelVideoDto } from './model-video.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, IAuthUser, JwtAuthGuard } from '../security';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ModelVideoFiles } from './model-video.model';

@ApiTags('Model Videos')
@ApiBearerAuth()
@Controller('model-videos')
export class ModelVideosController {
  constructor(private readonly modelVideosService: ModelVideosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnails[]', maxCount: 10 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  create(
    @Body() dto: CreateModelVideoDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: ModelVideoFiles,
  ) {
    return this.modelVideosService.create(dto, user, files);
  }

  @Get()
  findAll() {
    return this.modelVideosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelVideosService.findById(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateModelVideoDto: UpdateModelVideoDto,
  // ) {
  //   return this.modelVideosService.update(+id, updateModelVideoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.modelVideosService.remove(+id);
  // }
}
