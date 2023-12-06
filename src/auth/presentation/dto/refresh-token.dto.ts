import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: '발급받은 리프레시 토큰을 보내주세요.', example: 'eqlkjlkwajelk~' })
  @IsString()
  @IsNotEmpty()
  readonly refresh_token: string;
}
