import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { JwtUserPayloadDto } from '../dto/jwt-user-payload.dto';
import { ACCESS_TOKEN_COOKIE } from '../../../constants';

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secretKey = configService.get<string>('JWT_SECRET_KEY');
    if (!secretKey) throw new Error('JWT_SECRET_KEY is not defined');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null =>
          (req.cookies[ACCESS_TOKEN_COOKIE] as string | undefined) ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  validate(payload: JwtPayload): JwtUserPayloadDto {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
