import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class ResponseTokenDto {
  @ApiProperty()
  @IsString()
  @Expose()
  accessToken: string;

  @ApiProperty()
  @IsString()
  @Expose()
  refreshToken: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Expose()
  lastLoginAt?: Date = undefined;
}
