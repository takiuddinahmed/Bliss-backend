import {
  AuthUser,
  IAuthUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
} from '../security';
import { CouncilorService } from './councilor.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ROLE } from '../common/enum/user-role.enum';
import { CreateCouncilorDto, UpdateCouncilorDto } from './councilor.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CouncilorFiles } from './councilor.model';
import { LikeDislikeEnum } from '../common/enum/likeDislike.enum';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateRatingReviewDto } from '../common/models/ratingReview.model';

@ApiTags('Councilor')
@ApiBearerAuth()
@Controller('councilor')
export class CouncilorController {
  constructor(private readonly councilorService: CouncilorService) {}

  // create councilor
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePic', maxCount: 1 },
      { name: 'thumbnails', maxCount: 10 },
    ]),
  )
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.USER, ROLE.ADMIN)
  async createCouncilor(
    @Body() createCouncilorDto: CreateCouncilorDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: CouncilorFiles,
  ) {
    return await this.councilorService.createCouncilor(
      user,
      createCouncilorDto,
      files,
    );
  }

  @Get()
  async getAll() {
    return this.councilorService.getAll();
  }

  @Get('user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.councilorService.getByUser(userId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.councilorService.getOne(id);
  }

  @Get('permalink/:permalink')
  async getByPermalink(@Param('permalink') permalink: string) {
    return await this.councilorService.getOneByPermalink(permalink);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePic', maxCount: 1 },
      { name: 'thumbnails', maxCount: 10 },
    ]),
  )
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCouncilorDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() files: CouncilorFiles,
  ) {
    return await this.councilorService.update(id, dto, user, files);
  }

  @ApiParam({ name: 'likeDislike', enum: LikeDislikeEnum })
  @Put('/like-dislike/:id/:likeDislike')
  @UseGuards(JwtAuthGuard)
  async likeComment(
    @Param('id') id: string,
    @Param('likeDislike') likeDislike: LikeDislikeEnum,
    @AuthUser() user: IAuthUser,
  ) {
    return this.councilorService.likeDislikeContent(
      id,
      user._id.toString(),
      likeDislike,
    );
  }

  @Put('ratingReview/:id')
  @UseGuards(JwtAuthGuard)
  async ratingReview(
    @Param('id') id: string,
    @Body() dto: CreateRatingReviewDto,
    @AuthUser() user: IAuthUser,
  ) {
    return await this.councilorService.addRatingReview(
      id,
      user?._id?.toString(),
      dto,
    );
  }

  @Put('follow/:id')
  @UseGuards(JwtAuthGuard)
  async follow(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return await this.councilorService.follow(id, user?._id?.toString());
  }
  @Put('unfollow/:id')
  @UseGuards(JwtAuthGuard)
  async unfollow(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return await this.councilorService.unfollow(id, user?._id?.toString());
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return await this.councilorService.remove(id);
  }
}
