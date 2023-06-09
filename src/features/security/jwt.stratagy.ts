import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/features/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jf9e8jpaoijpoi',
    });
  }

  async validate(payload: { _id: string }) {
    const { _id } = payload;
    const user = await this.userService.getOne(_id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
