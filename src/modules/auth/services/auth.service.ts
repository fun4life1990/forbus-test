import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, CookieOptions } from 'express';

import { TokenService } from '../../auth-token/services/token.service';
import { JwtUserPayloadDto } from '../../auth-token/dto/jwt-user-payload.dto';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../../../constants';
import { LoginResponseDto } from '../dto/login-response.dto';
import { parseTtlToMs } from '../../../utils/parse-ttl';

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

    this.setTokenCookies(res, accessToken, refreshToken);

    return { id: user.id, email: user.email, role: user.role };
  }

  logout(res: Response): void {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
  }

  async refresh(user: JwtUserPayloadDto, res: Response): Promise<void> {
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(user);

    this.setTokenCookies(res, accessToken, refreshToken);
  }

  private setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const accessTtl = this.configService.get<string>('JWT_TTL') ?? '3600';
    const refreshTtl =
      this.configService.get<string>('JWT_REFRESH_TTL') ?? '604800';

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, this.cookieOptions(accessTtl));
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      refreshToken,
      this.cookieOptions(refreshTtl),
    );
  }

  private cookieOptions(ttl: string): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: parseTtlToMs(ttl),
    };
  }
}
