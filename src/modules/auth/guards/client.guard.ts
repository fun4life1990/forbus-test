import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtUserPayloadDto } from '../../auth-token/dto/jwt-user-payload.dto';
import { UserRole } from '../../user/schemas/user.schema';

@Injectable()
export class ClientGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtUserPayloadDto }>().user;
    if (!user || (user.role as UserRole) !== UserRole.Client) {
      throw new ForbiddenException('Client access required');
    }
    return true;
  }
}
