import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/utils/bcrypt.util';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, JwtPayloadWithToken } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async verify() {
    return 'verified';
  }

  async login(loginDto: LoginDto): Promise<JwtPayloadWithToken> {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) throw new NotAcceptableException('Invalid credential');
    const passwordValid = comparePassword(user.password, loginDto.password);
    if (!passwordValid) throw new NotAcceptableException('Invalid credential');

    const payload: JwtPayload = {
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken, ...payload };
  }
}
