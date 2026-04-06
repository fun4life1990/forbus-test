import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { JwtUserPayloadDto } from '../../auth-token/dto/jwt-user-payload.dto';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtUserPayloadDto =>
    ctx.switchToHttp().getRequest<Request & { user: JwtUserPayloadDto }>().user,
);
