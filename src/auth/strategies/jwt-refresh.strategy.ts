import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from 'src/common/interface/jwt-payload';
import { UsersService } from 'src/users/application/users.service';
import { JWT_REFRESH_GUARD } from 'src/common/constants/guards.constant';
import { JWT_REFRESH_TOKEN_SECRET } from 'src/common/constants/config.constant';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, JWT_REFRESH_GUARD) {
  // TODO: configService never used 에러 해결
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken: string = req.body.refresh;
    const userId = payload.sub;

    const user = await this.usersService.getUserIfRefreshTokenisMatched(refreshToken, userId);

    return user;
  }
}