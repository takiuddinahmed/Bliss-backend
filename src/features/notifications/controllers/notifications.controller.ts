import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import {
  CreateNotificationDTO,
  SearchNotificationDto,
  UpdateNotificationDTO,
} from '../dto';
import { JwtAuthGuard } from '../../security';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../../security/get-user.decorator';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@AuthUser() user, @Body() createDto: CreateNotificationDTO) {
    try {
      return this.notificationService.create(createDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDTO: UpdateNotificationDTO,
    @AuthUser() user,
  ) {
    return this.notificationService.update(id, updateNotificationDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateReadBulk(@AuthUser() user) {
    try {
      return this.notificationService.updateReadBulk(user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@AuthUser() user, @Query() query: SearchNotificationDto) {
    try {
      return this.notificationService.findAll(user, query);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
