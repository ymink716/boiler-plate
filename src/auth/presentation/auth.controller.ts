import { Controller, Get, UseGuards, Post, Res } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { GoogleOauthGuard } from '../guards/google-oauth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ 
    description: '구글 로그인 페이지로 이동하는 테스트용 API', 
  })
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async redirectGoogleAuthPage(): Promise<void> {}

  @ApiOperation({ 
    description: '구글 로그인 callback', 
    summary: '구글 로그인' 
  })
  @ApiResponse({
    status: 200,
    description: '성공 시 access_token과 refresh_token을 리턴합니다.',
  })
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async signInWithGoogle(@GetUser('id') userId: number) {
    const { accessToken, refreshToken } = await this.authService.signIn(userId);

    return { 
      access_token: accessToken, 
      refresh_token: refreshToken 
    };
  }

  @ApiOperation({ 
    description: 'refresh token으로 token을 재발급', 
    summary: '인증 토큰 재발급' 
  })
  @ApiBody({
    description: '발급받은 refresh token을 request body에 넣어 보내주세요',
    type: RefreshTokenDto,
  })
  @ApiResponse({
    description: '성공 시 갱신된 access_token과 refresh_token을 보냅니다.',
  })
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async reissueTokens(@GetUser('id') userId: number) {
    const { accessToken, refreshToken } = await this.authService.refresh(userId);

    return { 
      access_token: accessToken, 
      refresh_token: refreshToken 
    };  
  }

  @ApiOperation({ 
    summary: '로그아웃' 
  })
  @ApiBody({
    description: '발급받은 refresh token을 request body에 넣어 보내주세요',
    type: RefreshTokenDto,
  })
  @ApiResponse({
    status: 201,
    description: '로그아웃 성공',
  })
  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  async logout(@GetUser('id') userId: number) {
    await this.authService.logout(userId);
    
    return { success: true };
  }
}