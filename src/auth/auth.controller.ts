import { UsersService } from './../users/users.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
  async redirectGoogleAuthPage(): Promise<void> {

  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async getGoogleAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findByGoogleIdOrSave(req.user as GoogleUser);
    
    const payload: JwtPayload = { sub: user.id, email: user.email };

    const { accessToken, refreshToken } = this.authService.getToken(payload);

    res.cookie('access-token', accessToken);
    res.cookie('refresh-token', refreshToken);

    await this.usersService.updateHashedRefreshToken(user.id, refreshToken);

    res.redirect(String(process.env.DOMAIN));
  }
}
function Res(): (target: AuthController, propertyKey: "googleAuthCallback", parameterIndex: 1) => void {
  throw new Error('Function not implemented.');
}

