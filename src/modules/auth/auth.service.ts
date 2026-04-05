import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, CookieOptions } from 'express';

import { TokenService } from '../auth-token/services/token.service';
import { JwtUserPayloadDto } from '../auth-token/dto/jwt-user-payload.dto';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../../constants';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    user: JwtUserPayloadDto,
    res: Response,
  ): Promise<LoginResponseDto> {
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(user);

    const accessTtl = parseInt(
      this.configService.get<string>('JWT_TTL') ?? '3600',
      10,
    );
    const refreshTtl = parseInt(
      this.configService.get<string>('JWT_REFRESH_TTL') ?? '604800',
      10,
    );

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, this.cookieOptions(accessTtl));
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      refreshToken,
      this.cookieOptions(refreshTtl),
    );

    return { id: user.id, email: user.email, role: user.role };
  }

  logout(res: Response): void {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
  }

  async refresh(user: JwtUserPayloadDto, res: Response): Promise<void> {
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(user);

    const accessTtl = parseInt(
      this.configService.get<string>('JWT_TTL') ?? '3600',
      10,
    );
    const refreshTtl = parseInt(
      this.configService.get<string>('JWT_REFRESH_TTL') ?? '604800',
      10,
    );

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, this.cookieOptions(accessTtl));
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      refreshToken,
      this.cookieOptions(refreshTtl),
    );
  }

  private cookieOptions(maxAgeSeconds: number): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAgeSeconds * 1000,
    };
  }
}
