import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/interface/jwt-payload';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async signIn(userId: number) {
    return await this.issueTokens(userId);
  }

  async reissueTokens(userId: number) {
    return await this.issueTokens(userId);
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
  }

  async issueTokens(userId: number) {
    const jwtPayload: JwtPayload = { sub: userId };

    const { accessToken, refreshToken } = this.createJwtTokens(jwtPayload);

    await this.usersService.updateHashedRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  createJwtTokens(jwtPayload: JwtPayload) {
    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });

    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    });

    return { accessToken, refreshToken };
  }
}
