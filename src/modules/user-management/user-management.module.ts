import { Module } from '@nestjs/common';
import { ClientUserModule } from '../client-user/client-user.module';
import { UserManagementService } from './services/user-management.service';
import { UserManagementController } from './controllers/user-management.controller';

@Module({
  imports: [ClientUserModule],
  providers: [UserManagementService],
  controllers: [UserManagementController],
})
export class UserManagementModule {}
