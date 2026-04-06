import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AuthTokenModule } from '../auth-token/auth-token.module';
import { UserModule } from '../user/user.module';
import { ClientService } from './services/client.service';
import { ClientController } from './controllers/client.controller';
import { ClientGateway } from './gateways/client.gateway';

@Module({
  imports: [AuthModule, AuthTokenModule, UserModule],
  providers: [ClientService, ClientGateway],
  controllers: [ClientController],
})
export class ClientModule {}
