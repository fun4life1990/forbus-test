import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, Min } from 'class-validator';

export class CreateSymbolDto {
  @ApiProperty({ example: 'Bitcoin' })
  @IsString()
  name: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isPublished: boolean;

  @ApiProperty({ example: 42000.5 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'BTC' })
  @IsString()
  providerSymbol: string;
}
