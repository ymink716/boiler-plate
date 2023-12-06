import { UsersService } from '../../users/application/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/common/interface/jwt-payload';
import { UnauthorizedUser } from '../../common/exception/error-types';
import { JWT_AUTH_GUARD } from 'src/common/constants/guards.constant';
import { JWT_ACCESS_TOKEN_SECRET } from 'src/common/constants/config.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_AUTH_GUARD) {
  // TODO: configService never used 에러 해결
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),      
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_ACCESS_TOKEN_SECRET),
    });
  }

  async validate(payload: JwtPayload) {
    const userId = payload.sub;

    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException(UnauthorizedUser.message, UnauthorizedUser.name);
    }

    return user;
  }
}