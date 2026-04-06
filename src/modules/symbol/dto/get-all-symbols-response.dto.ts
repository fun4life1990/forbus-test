import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SymbolResponseDto } from './symbol-response.dto';

export class PaginationMeta {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class GetAllSymbolsResponseDto {
  @ApiProperty({ type: [SymbolResponseDto] })
  @Expose()
  @Type(() => SymbolResponseDto)
  data: SymbolResponseDto[];

  @ApiProperty({ type: PaginationMeta })
  @Expose()
  meta: PaginationMeta;
}
