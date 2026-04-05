import { Module } from '@nestjs/common';

import { AuthTokenModule } from '../auth-token/auth-token.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthTokenModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
