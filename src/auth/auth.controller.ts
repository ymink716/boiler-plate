import { UsersService } from './../users/users.service';
import { Controller, Get, Req, Res, UseGuards, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtPayload } from 'src/common/interface/jwt-payload';
import { OauthPayload } from 'src/common/interface/oauth-payload';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { RefreshPayload } from 'src/common/interface/refresh-payload';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async redirectGoogleAuthPage(): Promise<void> {}

  // TODO: 타입 지정 방식 변경
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async signInWithGoogle(@Req() req: Request, @Res() res: Response) {
    const user = await this.usersService.findByProviderIdOrSave(req.user as OauthPayload);
    
    const jwtPayload: JwtPayload = { sub: user.id, email: user.email };

    const { accessToken, refreshToken } = this.authService.getToken(jwtPayload);

    res.cookie('Authentication', accessToken);
    res.cookie('Refresh', refreshToken);

    await this.usersService.updateHashedRefreshToken(user.id, refreshToken);

    res.json({ accessToken, refreshToken });
  }

  // TODO: 타입 지정 방식 변경
  @Get('access-token')
  @UseGuards(JwtRefreshGuard)
  async reissueToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, sub, email } = req.user as RefreshPayload;

    const user = await this.usersService.findUserById(sub);

    await this.usersService.checkRefreshToken(refreshToken, user.hashedRefreshToken);

    const token = this.authService.getToken({ sub, email });

    res.cookie('Authentication', token.accessToken);
    res.cookie('Refresh', token.refreshToken);

    await this.usersService.updateHashedRefreshToken(user.id, refreshToken);
    
    return { accessToken: token.accessToken, refreshToken: token.refreshToken };
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { sub } = req.user as RefreshPayload;
    
    await this.usersService.removeRefreshToken(sub);

    res.cookie('Authentication', '');
    res.cookie('Refresh', '');
    
    res.json({ success: true });
  }
}