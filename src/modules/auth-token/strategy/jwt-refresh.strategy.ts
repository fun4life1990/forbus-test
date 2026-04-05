import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

import { JwtUserPayloadDto } from '../dto/jwt-user-payload.dto';
import { REFRESH_TOKEN_COOKIE } from '../../../constants';

import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    const secretKey = configService.get<string>('JWT_REFRESH_SECRET_KEY');
    if (!secretKey) throw new Error('JWT_REFRESH_SECRET_KEY is not defined');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.[REFRESH_TOKEN_COOKIE] ?? null,
      ]),
      secretOrKey: secretKey,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtUserPayloadDto {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
