import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../security';
import { SearchActivityLogDto } from './dto';

import { ActivityLogService } from './activity-log.service';

@ApiTags('Activity Log')
@ApiBearerAuth()
@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly logService: ActivityLogService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: SearchActivityLogDto) {
    return this.logService.findAll(query);
  }
}
