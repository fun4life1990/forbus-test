import { Injectable } from '@nestjs/common';
import { SymbolService } from '../../symbol/services/symbol.service';
import { CreateSymbolDto } from '../../symbol/dto/create-symbol.dto';
import { UpdateSymbolDto } from '../../symbol/dto/update-symbol.dto';
import { FilterSymbolsDto } from '../../symbol/dto/filter-symbols.dto';
import { GetAllSymbolsResponseDto } from '../../symbol/dto/get-all-symbols-response.dto';
import { SymbolDocument } from '../../symbol/schemas/symbol.schema';

@Injectable()
export class SymbolManagementService {
  constructor(private readonly symbolService: SymbolService) {}

  findAll(filter: FilterSymbolsDto): Promise<GetAllSymbolsResponseDto> {
    return this.symbolService.findAll(filter);
  }

  findById(id: string): Promise<SymbolDocument> {
    return this.symbolService.findById(id);
  }

  create(dto: CreateSymbolDto): Promise<SymbolDocument> {
    return this.symbolService.create(dto);
  }

  update(id: string, dto: UpdateSymbolDto): Promise<SymbolDocument> {
    return this.symbolService.update(id, dto);
  }

  delete(id: string): Promise<void> {
    return this.symbolService.delete(id);
  }
}
