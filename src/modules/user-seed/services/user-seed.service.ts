import { Injectable, Logger } from '@nestjs/common';
import { UserRole } from '../../user/schemas/user.schema';
import { UserService } from '../../user/services/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { HashService } from '../../hash/hash.service';

@Injectable()
export class UserSeedService {
  private readonly logger = new Logger(UserSeedService.name);

  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
  ) {}

  private readonly users: CreateUserDto[] = [
    {
      email: 'admin@admin.com',
      password: '12345678',
      role: UserRole.Admin,
    },
  ];

  async run(): Promise<void> {
    for (const userData of this.users) {
      const existing = await this.userService.findByEmail(userData.email);
      if (existing) {
        this.logger.log(`User ${userData.email} already exists, skipping.`);
        continue;
      }
      await this.userService.create({
        ...userData,
        password: await this.hashService.hash(userData.password),
      });
      this.logger.log(`User ${userData.email} created.`);
    }
  }
}
