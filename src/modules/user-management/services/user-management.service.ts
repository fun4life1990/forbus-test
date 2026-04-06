import { Injectable } from '@nestjs/common';
import { ClientUserService } from '../../client-user/services/client-user.service';
import { CreateUserRequestDto } from '../dto/requests/create-user-request.dto';

@Injectable()
export class UserManagementService {
  constructor(private readonly clientUserService: ClientUserService) {}

  async getClients() {
    return await this.clientUserService.findAll();
  }

  async createClient(dto: CreateUserRequestDto): Promise<void> {
    await this.clientUserService.create({
      email: dto.email,
      password: dto.password,
    });
  }

  async deleteClient(id: string): Promise<void> {
    await this.clientUserService.deleteById(id);
  }
}
