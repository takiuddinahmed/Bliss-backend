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
  UseGuards,
} from '@nestjs/common';
import { ROLE } from '../common/enum/user-role.enum';
import { CreateCouncilorDto } from './councilor.dto';

@Controller('councilor')
export class CouncilorController {
  constructor(private readonly councilorService: CouncilorService) {}

  // create councilor
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.USER, ROLE.ADMIN)
  async createCouncilor(
    @Body() createCouncilorDto: CreateCouncilorDto,
    @AuthUser() user: IAuthUser,
  ) {
    return await this.councilorService.createCouncilor(
      user,
      createCouncilorDto,
    );
  }
}
