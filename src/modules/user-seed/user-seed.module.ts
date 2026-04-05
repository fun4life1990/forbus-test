import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserSeedService } from './services/user-seed.service';
import { UserSeedCommand } from './commands/user-seed.command';
import { HashModule } from '../hash/hash.module';

@Module({
  imports: [UserModule, HashModule],
  providers: [UserSeedService, UserSeedCommand],
  exports: [UserSeedCommand],
})
export class UserSeedModule {}
