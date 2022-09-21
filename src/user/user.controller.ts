import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthUser, IAuthUser, JwtAuthGuard } from 'src/security';
import { EditPassDto } from './dto/editPassword.dto';
import { EditUserDto } from './dto/editUser.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return await this.userService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getOne(@AuthUser() user: IAuthUser): Promise<User> {
    return await this.userService.getOne(user._id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async edit(
    @AuthUser() authUser: IAuthUser,
    @Body() editUserDto: EditUserDto,
  ): Promise<User> {
    return await this.userService.editUser(authUser._id, editUserDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async editPassword(
    @AuthUser() authUser: IAuthUser,
    @Body() editPassDto: EditPassDto,
  ): Promise<User> {
    return await this.userService.editPassword(authUser._id, editPassDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async delete(@AuthUser() authUser: IAuthUser) {
    return await this.userService.deleteUser(authUser._id);
  }
}
