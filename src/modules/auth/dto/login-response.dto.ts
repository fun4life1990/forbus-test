import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: '64b123abc456def789012345' })
  id: string;

  @ApiProperty({ example: 'user@mail.com' })
  email: string;

  @ApiProperty({ example: 'Client' })
  role: string;
}
