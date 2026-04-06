import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserRole, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';
import {
  ClientUser,
  ClientUserSchema,
} from '../client-user/schemas/client-user.schema';
import {
  AdminUser,
  AdminUserSchema,
} from '../admin-user/schemas/admin-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [
          {
            name: ClientUser.name,
            schema: ClientUserSchema,
            value: UserRole.Client,
          },
          {
            name: AdminUser.name,
            schema: AdminUserSchema,
            value: UserRole.Admin,
          },
        ],
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
