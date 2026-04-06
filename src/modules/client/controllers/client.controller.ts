import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth-token/guard/jwt-auth.guard';
import { ClientGuard } from '../../auth/guards/client.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtUserPayloadDto } from '../../auth-token/dto/jwt-user-payload.dto';
import { Serialize } from '../../../utils/serialize.interceptor';
import { ClientService } from '../services/client.service';
import { MeResponseDto } from '../dto/responses/me-response.dto';

@ApiTags('client')
@ApiCookieAuth()
@Controller('client')
@UseGuards(JwtAuthGuard, ClientGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('me')
  @Serialize(MeResponseDto)
  getMe(@CurrentUser() user: JwtUserPayloadDto) {
    return this.clientService.getMe(user.id);
  }
}
