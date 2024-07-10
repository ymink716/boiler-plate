import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/interface/jwt-payload';
import { UsersService } from 'src/users/application/users.service';
import { JWT_ACCESS_TOKEN_EXPIRATION_TIME, JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_EXPIRATION_TIME, JWT_REFRESH_TOKEN_SECRET, OAUTH_GOOGLE_ID, OAUTH_GOOGLE_SECRET } from 'src/common/constants/config.constant';
import { OAuth2Client } from 'google-auth-library';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { UnauthorizedUser } from 'src/common/exception/error-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  public async loginWithGoogleAccount(authCode: string) {
    const { providerId, email } = await this.getGoogleOauthPayload(authCode);

    let user = await this.usersService.findUserByProviderId(providerId);
    let isNew = false;

    if (!user) {
      user = await this.usersService.register(providerId, email, UserProvider.GOOGLE);
      isNew = true;
    }

    const tokens = await this.issueTokens(user.getId());

    return { user, isNew, tokens }
  }

  private async getGoogleOauthPayload(authCode: string) {
    const oauthClient = new OAuth2Client(
      this.configService.get<string>(OAUTH_GOOGLE_ID),
      this.configService.get<string>(OAUTH_GOOGLE_SECRET),
      "postmessage",
    );
    
    const response = await oauthClient.getToken(authCode);
    
    if (!response.tokens.access_token) {
      throw new UnauthorizedException(UnauthorizedUser.message, UnauthorizedUser.name);
    }
    
    const payload = await oauthClient.getTokenInfo(response.tokens.access_token);
    if (!payload.email || !payload.sub) {
      throw new UnauthorizedException(UnauthorizedUser.message, UnauthorizedUser.name);
    }
    
    return { providerId: payload.sub, email: payload.email };
  }

  public async refresh(userId: number) {
    return await this.issueTokens(userId);
  }

  private async issueTokens(userId: number) {
    const jwtPayload: JwtPayload = { sub: userId };

    const accessToken = this.generateAccessToken(jwtPayload);
    const refreshToken = this.generateRefreshToken(jwtPayload);

    await this.usersService.updateRefreshToken(userId, refreshToken);

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

  public async validateToken(accessToken: string, secret: string) {
    try {
      return await this.jwtService.verifyAsync(accessToken, { secret });
    } catch (error) {
      return false;
    }
  }
}
