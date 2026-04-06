import {
  Controller,
  Post,
  Put,
  UseGuards,
  Res,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { AuthDto } from '../../auth-token/dto/auth.dto';
import { PasswordAuthGuard } from '../../auth-token/guard/password-auth.guard';
import { JwtAuthGuard } from '../../auth-token/guard/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../../auth-token/guard/jwt-refresh-auth.guard';
import { JwtUserPayloadDto } from '../../auth-token/dto/jwt-user-payload.dto';
import { AuthService } from '../services/auth.service';
import { LoginResponseDto } from '../dto/login-response.dto';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(PasswordAuthGuard)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
    description: 'Logged in, tokens set in cookies',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @CurrentUser() user: JwtUserPayloadDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    return this.authService.login(user, res);
  }

  @Put('logout')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('cookie-auth')
  @ApiOperation({ summary: 'Logout and clear auth cookies' })
  @ApiResponse({ status: 200, description: 'Logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(@Res({ passthrough: true }) res: Response): void {
    this.authService.logout(res);
  }

  @Put('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(204)
  @ApiCookieAuth('cookie-auth')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiResponse({
    status: 204,
    description: 'Tokens refreshed, new tokens set in cookies',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(
    @CurrentUser() user: JwtUserPayloadDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.refresh(user, res);
  }
}
