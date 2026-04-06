import { Module } from '@nestjs/common';

import { AuthTokenModule } from '../auth-token/auth-token.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [AuthTokenModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
