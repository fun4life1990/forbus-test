import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserModule } from '../user/user.module';
import { HashModule } from '../hash/hash.module';

import { TokenService } from './services/token.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { SignOptions } from 'jsonwebtoken';

@Module({
  imports: [
    UserModule,
    HashModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_SECRET',
          ) as SignOptions['expiresIn'],
        },
        algorithm: 'HS256',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokenService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [TokenService],
})
export class AuthTokenModule {}
