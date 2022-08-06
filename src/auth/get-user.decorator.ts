import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from './jwt-payload.interface';

export const AuthUser = createParamDecorator(
  (data, ctx: ExecutionContext): IAuthUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
