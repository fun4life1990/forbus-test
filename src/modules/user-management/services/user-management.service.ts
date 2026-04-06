import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientUserService } from '../../client-user/services/client-user.service';
import { CreateUserRequestDto } from '../dto/requests/create-user-request.dto';
import { DISCONNECT_CLIENT_EVENT } from '../user-management.events';

@Injectable()
export class UserManagementService {
  constructor(
    private readonly clientUserService: ClientUserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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

  disconnectClientSocket(userId: string): void {
    this.eventEmitter.emit(DISCONNECT_CLIENT_EVENT, userId);
  }
}
