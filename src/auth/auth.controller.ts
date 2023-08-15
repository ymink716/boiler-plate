import { UsersService } from './../users/users.service';
import { Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async redirectGoogleAuthPage(@Res() res: Response): Promise<void> {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async getGoogleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = await this.usersService.findByGoogleIdOrSave(req.user as GoogleUser);
    
    const payload: JwtPayload = { sub: user.id, email: user.email };

    const { accessToken, refreshToken } = this.authService.getToken(payload);

    res.cookie('Authentication', accessToken);
    res.cookie('Refresh', refreshToken);

    await this.usersService.updateHashedRefreshToken(user.id, refreshToken);

    res.json({ accessToken, refreshToken });
  }

  // TODO: 타입 지정 방식 변경
  @Post('refresh')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshJwtToken(@Req() req: Request, @Res() res: Response) {
    const { refreshToken, sub, email } = req.user as JwtPayload  & {
      refreshToken: string;
    };

    const user = await this.usersService.findUserByIdAndRefreshToken(sub, refreshToken);

    const token = this.authService.getToken({ sub, email });

    res.cookie('Authentication', token.accessToken);
    res.cookie('Refresh', token.refreshToken);

    await this.usersService.updateHashedRefreshToken(user.id, refreshToken);

    return { accessToken: token.accessToken, refreshToken: token.refreshToken };
  }
}

