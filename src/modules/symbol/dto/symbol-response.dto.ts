import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SymbolResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  isPublished: boolean;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  providerSymbol: string;
}
