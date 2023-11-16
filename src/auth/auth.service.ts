import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/interface/jwt-payload';
import { UsersService } from 'src/users/users.service';
import { JWT_ACCESS_TOKEN_EXPIRATION_TIME, JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_EXPIRATION_TIME, JWT_REFRESH_TOKEN_SECRET } from 'src/common/constants/config.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  public async signIn(userId: number) {
    return await this.issueTokens(userId);
  }

  public async refresh(userId: number) {
    return await this.issueTokens(userId);
  }

  async issueTokens(userId: number) {
    const jwtPayload: JwtPayload = { sub: userId };

    const accessToken = this.generateAccessToken(jwtPayload);
    const refreshToken = this.generateRefreshToken(jwtPayload);

    await this.usersService.updateHashedRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  private generateAccessToken(jwtPayload: JwtPayload) {
    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get<string>(JWT_ACCESS_TOKEN_EXPIRATION_TIME),
      secret: this.configService.get<string>(JWT_ACCESS_TOKEN_SECRET),
    });

    return accessToken;
  }

  private generateRefreshToken(jwtPayload: JwtPayload) {
    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get<string>(JWT_REFRESH_TOKEN_EXPIRATION_TIME),
      secret: this.configService.get<string>(JWT_REFRESH_TOKEN_SECRET),
    });

    return refreshToken;
  }

  public async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
  }
}
