import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MeResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  role: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
