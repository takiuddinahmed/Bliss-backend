import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('role', context.getHandler());
    if (!roles?.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (roles.some((role) => role === user.role)) {
      return true;
    }
    return false;
  }
}
