import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from '../../user/services/user.service';
import { HashService } from '../../hash/hash.service';
import { JwtUserPayloadDto } from '../dto/jwt-user-payload.dto';
import { ResponseTokenDto } from '../dto/response-token.dto';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { ForbiddenError } from '../../../error/forbidden.error';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { SignOptions } from 'jsonwebtoken';

@Injectable()
export class TokenService {
  protected readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signAsync(payload: object, options?: JwtSignOptions): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }

  async generateTokens(
    userPayload: JwtUserPayloadDto,
  ): Promise<ResponseTokenDto> {
    const accessToken = await this.generateAccessToken({
      sub: userPayload.id,
      email: userPayload.email,
      role: userPayload.role,
    });

    const refreshToken = await this.generateRefreshToken({
      sub: userPayload.id,
      email: userPayload.email,
      role: userPayload.role,
    });

    return { accessToken, refreshToken };
  }

  async generateAccessToken(payload: JwtPayloadDto): Promise<string> {
    const secret = this.configService.get<string>('JWT_SECRET_KEY');
    const expiresIn = this.configService.get<string>('JWT_TTL');

    if (!secret || !expiresIn) {
      throw new Error('JWT Secret key is not defined in environment variables');
    }

    return this.generateJwtToken(payload, secret, expiresIn);
  }

  async generateRefreshToken(payload: JwtPayloadDto): Promise<string> {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET_KEY');
    const expiresIn = this.configService.get<string>('JWT_REFRESH_TTL');

    if (!secret || !expiresIn) {
      throw new Error(
        'JWT Refresh Secret key is not defined in environment variables',
      );
    }

    return this.generateJwtToken(payload, secret, expiresIn);
  }

  async generateJwtToken(
    payload: JwtPayloadDto,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    try {
      return await this.signAsync(payload, {
        secret,
        expiresIn: expiresIn as SignOptions['expiresIn'],
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async generate2FAToken(payload: JwtPayloadDto): Promise<string> {
    const secret = this.configService.get<string>('JWT_2FA_SECRET_KEY');
    const expiresIn = this.configService.get<string>('JWT_2FA_TTL');

    if (!secret || !expiresIn) {
      throw new Error('JWT Secret key is not defined in environment variables');
    }

    return this.generateJwtToken(payload, secret, expiresIn);
  }

  async verifyAccessToken(token: string): Promise<JwtPayloadDto> {
    const secret = this.configService.get<string>('JWT_SECRET_KEY');
    if (!secret) throw new Error('JWT_SECRET_KEY is not defined');
    return this.jwtService.verifyAsync<JwtPayloadDto>(token, { secret });
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDocument> {
    const user: UserDocument | null =
      await this.userService.findByEmail(username);

    if (!user) {
      throw new ForbiddenError('Invalid email or password');
    }

    if (user.deletedAt) {
      throw new ForbiddenError(
        'Your account is suspended. Please contact support for further assistance',
      );
    }

    const passwordIsValid = await this.hashService.compareHashed(
      password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new ForbiddenError('Invalid email or password');
    }

    return user;
  }
}
