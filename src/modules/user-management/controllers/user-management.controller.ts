import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth-token/guard/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Serialize } from '../../../utils/serialize.interceptor';
import { UserManagementService } from '../services/user-management.service';
import { CreateUserRequestDto } from '../dto/requests/create-user-request.dto';
import { UserResponseDto } from '../dto/responses/user-response.dto';

@ApiTags('client')
@ApiCookieAuth()
@Controller('client')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Get()
  @Serialize(UserResponseDto)
  getClients() {
    return this.userManagementService.getClients();
  }

  @Post()
  @HttpCode(201)
  createClient(@Body() dto: CreateUserRequestDto): Promise<void> {
    return this.userManagementService.createClient(dto);
  }

  @Delete(':clientId')
  @HttpCode(204)
  deleteClient(@Param('clientId') clientId: string): Promise<void> {
    return this.userManagementService.deleteClient(clientId);
  }

  @Post(':clientId/disconnect')
  @HttpCode(204)
  disconnectClient(@Param('clientId') clientId: string): void {
    this.userManagementService.disconnectClientSocket(clientId);
  }
}
