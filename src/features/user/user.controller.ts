import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, IAuthUser, JwtAuthGuard } from 'src/features/security';
import { EditPassDto } from './dto/editPassword.dto';
import { EditUserDto } from './dto/editUser.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './user.model';
import { UserService } from './user.service';
import { ActivityLogInterceptor } from '../activity-log/activity-log.interceptor';
import { NotificationInterceptor } from '../notifications/interceptors/notifications.interceptor';


@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @UseInterceptors(NotificationInterceptor)
  @UseInterceptors(ActivityLogInterceptor)
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return await this.userService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getOne(@AuthUser() user: IAuthUser): Promise<User> {
    return await this.userService.getOne(user._id.toString());
  }

  @UseInterceptors(FileInterceptor('proPic'))
  @Patch()
  @UseGuards(JwtAuthGuard)
  async edit(
    @AuthUser() authUser: IAuthUser,
    @Body() editUserDto: EditUserDto,
    @UploadedFile() proPicFile?: Express.Multer.File,
  ): Promise<User> {
    return await this.userService.editUser(
      authUser._id.toString(),
      editUserDto,
      proPicFile,
    );
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async editPassword(
    @AuthUser() authUser: IAuthUser,
    @Body() editPassDto: EditPassDto,
  ): Promise<User> {
    return await this.userService.editPassword(
      authUser._id.toString(),
      editPassDto,
    );
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async delete(@AuthUser() authUser: IAuthUser) {
    return await this.userService.deleteUser(authUser._id.toString());
  }
}
