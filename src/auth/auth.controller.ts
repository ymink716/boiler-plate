import { Controller, Get, UseGuards, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async redirectGoogleAuthPage(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async signInWithGoogle(
    @GetUser('id') userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(userId);

    res.setHeader('Authorization', 'Bearer ' + accessToken);

    return { 
      access_token: accessToken, 
      refresh_token: refreshToken 
    };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async reissueTokens(
    @GetUser('id') userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(userId);

    res.setHeader('Authorization', 'Bearer ' + accessToken);

    return { 
      access_token: accessToken, 
      refresh_token: refreshToken 
    };  
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  async logout(@GetUser('id') userId: number) {
    await this.authService.logout(userId);
    
    return { success: true };
  }
}