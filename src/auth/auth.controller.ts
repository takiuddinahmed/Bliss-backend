import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { AuthUser } from 'src/security/get-user.decorator';
import { IAuthUser } from 'src/security/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async verify(@AuthUser() user: IAuthUser) {
    return await this.authService.verify(user._id);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
