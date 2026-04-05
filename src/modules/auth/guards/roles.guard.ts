import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '../../user/schemas/user.schema';
import { JwtUserPayloadDto } from '../../auth-token/dto/jwt-user-payload.dto';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const user: JwtUserPayloadDto = context.switchToHttp().getRequest().user;
    return requiredRoles.includes(user?.role as UserRole);
  }
}
