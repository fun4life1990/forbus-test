import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AdminUserService } from './services/admin-user.service';

@Module({
  imports: [UserModule],
  providers: [AdminUserService],
  exports: [AdminUserService],
})
export class AdminUserModule {}
