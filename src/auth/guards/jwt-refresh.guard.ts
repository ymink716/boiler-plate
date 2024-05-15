import {  ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_REFRESH_GUARD } from 'src/common/constants/guards.constant';
import { AuthService } from '../application/auth.service';
import { RefreshTokenHasExpired } from 'src/common/exception/error-types';
import { ConfigService } from '@nestjs/config';
import { JWT_REFRESH_TOKEN_SECRET } from 'src/common/constants/config.constant';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_GUARD) {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.body['refresh'];
    if (!refreshToken) {
      throw new UnauthorizedException(RefreshTokenHasExpired.message, RefreshTokenHasExpired.name)
    }
    
    const secret = this.configService.get<string>(JWT_REFRESH_TOKEN_SECRET);
    const isValidRefreshToken = await this.authService.validateToken(refreshToken, String(secret));
    if (!isValidRefreshToken) {
      throw new UnauthorizedException(RefreshTokenHasExpired.message, RefreshTokenHasExpired.name)
    }
      
    return this.activate(context);
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}