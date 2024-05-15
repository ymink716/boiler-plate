import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/login/google')
  async signinUsingGoogleAccount(@Body('code') code: string) {
    return await this.authService.loginWithGoogleAccount(code);
  }

  @ApiOperation({ 
    description: 'refresh token으로 token 재발급', 
    summary: '인증 토큰 재발급' 
  })
  @ApiBody({
    description: '{ refresh: "refresh token here }',
  })
  @ApiResponse({
    description: '성공 시 갱신된 access_token과 refresh_token을 보냅니다.',
  })
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async reissueTokens(@GetUser('id') userId: number) {
    return await this.authService.refresh(userId);
  }
}