import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_AUTH_GUARD } from 'src/common/constants/guards.constant';
import { AuthService } from '../application/auth.service';
import { AccessTokenHasExpired } from 'src/common/exception/error-types';
import { ConfigService } from '@nestjs/config';
import { JWT_ACCESS_TOKEN_SECRET } from 'src/common/constants/config.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_AUTH_GUARD) {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let accessToken;

    if(request.headers.authorization) { 
      accessToken = request.headers.authorization.split(' ')[1]; 
    }
    if (!accessToken) {
      throw new UnauthorizedException(AccessTokenHasExpired.message, AccessTokenHasExpired.name)
    }

    const secret = this.configService.get<string>(JWT_ACCESS_TOKEN_SECRET);
    const isValidAccessToken = await this.authService.validateToken(accessToken, String(secret));
    if (!isValidAccessToken) {
      throw new UnauthorizedException(AccessTokenHasExpired.message, AccessTokenHasExpired.name)
    }

    return this.activate(context);
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}