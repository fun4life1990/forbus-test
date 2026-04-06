import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { HashModule } from '../hash/hash.module';
import { ClientUserService } from './services/client-user.service';

@Module({
  imports: [UserModule, HashModule],
  providers: [ClientUserService],
  exports: [ClientUserService],
})
export class ClientUserModule {}
