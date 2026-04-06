import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtUserPayloadDto } from '../dto/jwt-user-payload.dto';
import { TokenService } from '../services/token.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: TokenService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<JwtUserPayloadDto> {
    try {
      const user = await this.authService.validateUser(email, password);

      return { id: `${user.id}`, email: user.email, role: user.role };
    } catch (e: unknown) {
      throw new UnauthorizedException((e as Error).message);
    }
  }
}
