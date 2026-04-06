import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { TokenService } from '../../auth-token/services/token.service';
import { ACCESS_TOKEN_COOKIE } from '../../../constants';
import { UserRole } from '../../user/schemas/user.schema';

@Injectable()
export class WebSocketAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = this.extractToken(client);

    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const payload = await this.tokenService.verifyAccessToken(token);

      if ((payload.role as UserRole) !== UserRole.Client) {
        throw new WsException('Forbidden');
      }

      (client.data as Record<string, unknown>).user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      return true;
    } catch (err) {
      if (err instanceof WsException) throw err;
      throw new WsException('Unauthorized');
    }
  }

  extractToken(client: Socket): string | null {
    const cookieHeader = client.handshake.headers.cookie ?? '';
    const entry = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith(`${ACCESS_TOKEN_COOKIE}=`));
    return entry ? entry.trim().slice(ACCESS_TOKEN_COOKIE.length + 1) : null;
  }
}
