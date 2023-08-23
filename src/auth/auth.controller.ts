import { UsersService } from './../users/users.service';
import { Controller, Get, UseGuards, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async redirectGoogleAuthPage(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async signInWithGoogle(@GetUser('id') userId: number) {
    const { accessToken, refreshToken } = await this.authService.issueTokens(userId);

    return { 
      access_token: accessToken, 
      refresh_token: refreshToken 
    };
  }

  @Get('token')
  @UseGuards(JwtRefreshGuard)
  async reissueTokens(@GetUser('id') userId: number) {
    const { accessToken, refreshToken } = await this.authService.issueTokens(userId);

    return { 
      access_token: accessToken, 
      refresh_token: refreshToken 
    };  
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@GetUser('id') userId: number) {
    await this.usersService.removeRefreshToken(userId);
    
    return { success: true };
  }
}