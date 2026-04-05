import { Command, CommandRunner } from 'nest-commander';
import { UserSeedService } from '../services/user-seed.service';

@Command({ name: 'user-seed', description: 'Seed initial user data' })
export class UserSeedCommand extends CommandRunner {
  constructor(private readonly userSeedService: UserSeedService) {
    super();
  }

  async run(): Promise<void> {
    await this.userSeedService.run();
  }
}
