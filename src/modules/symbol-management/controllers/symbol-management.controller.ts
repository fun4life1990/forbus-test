import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth-token/guard/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtUserPayloadDto } from '../../auth-token/dto/jwt-user-payload.dto';
import { Serialize } from '../../../utils/serialize.interceptor';
import { SymbolManagementService } from '../services/symbol-management.service';
import { CreateSymbolDto } from '../../symbol/dto/create-symbol.dto';
import { UpdateSymbolDto } from '../../symbol/dto/update-symbol.dto';
import { FilterSymbolsDto } from '../../symbol/dto/filter-symbols.dto';
import { SymbolResponseDto } from '../../symbol/dto/symbol-response.dto';
import { GetAllSymbolsResponseDto } from '../../symbol/dto/get-all-symbols-response.dto';

@ApiTags('symbol')
@ApiCookieAuth()
@Controller('symbol')
@UseGuards(JwtAuthGuard)
export class SymbolManagementController {
  constructor(
    private readonly symbolManagementService: SymbolManagementService,
  ) {}

  @Get()
  @Serialize(GetAllSymbolsResponseDto)
  findAll(
    @Query() filter: FilterSymbolsDto,
    @CurrentUser() user: JwtUserPayloadDto,
  ) {
    return this.symbolManagementService.findAll(filter, user);
  }

  @Get(':symbolId')
  @Serialize(SymbolResponseDto)
  findById(
    @Param('symbolId') symbolId: string,
    @CurrentUser() user: JwtUserPayloadDto,
  ) {
    return this.symbolManagementService.findById(symbolId, user);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AdminGuard)
  @Serialize(SymbolResponseDto)
  create(@Body() dto: CreateSymbolDto) {
    return this.symbolManagementService.create(dto);
  }

  @Put(':symbolId')
  @UseGuards(AdminGuard)
  @Serialize(SymbolResponseDto)
  update(@Param('symbolId') symbolId: string, @Body() dto: UpdateSymbolDto) {
    return this.symbolManagementService.update(symbolId, dto);
  }

  @Delete(':symbolId')
  @HttpCode(204)
  @UseGuards(AdminGuard)
  delete(@Param('symbolId') symbolId: string) {
    return this.symbolManagementService.delete(symbolId);
  }
}
