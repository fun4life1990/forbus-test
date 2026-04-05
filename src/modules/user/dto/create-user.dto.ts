import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
}
