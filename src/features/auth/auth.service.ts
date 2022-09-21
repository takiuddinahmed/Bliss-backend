import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, JwtPayloadWithToken } from 'src/features/security';
import { UserService } from 'src/features/user';
import { comparePassword } from 'src/features/utils/bcrypt.util';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async verify(id: string) {
    return await this.userService.getOne(id);
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
