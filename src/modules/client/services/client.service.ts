import { Injectable } from '@nestjs/common';

import { UserService } from '../../user/services/user.service';
import { User } from '../../user/schemas/user.schema';
import { NotFoundError } from '../../../error/not-found.error';

@Injectable()
export class ClientService {
  constructor(private readonly userService: UserService) {}

  async getMe(userId: string): Promise<User> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
