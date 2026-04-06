import { Module } from '@nestjs/common';

import { AuthTokenModule } from '../auth-token/auth-token.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { WebSocketAuthGuard } from './guards/websocket-auth.guard';

@Module({
  imports: [AuthTokenModule],
  providers: [AuthService, WebSocketAuthGuard],
  controllers: [AuthController],
  exports: [WebSocketAuthGuard],
})
export class AuthModule {}
