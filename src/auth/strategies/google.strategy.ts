import { UnauthorizedUser } from './../../common/exception/error-types';
import { UsersService } from './../../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { OAUTH_GOOGLE_CALLBACK, OAUTH_GOOGLE_ID, OAUTH_GOOGLE_SECRET } from 'src/common/constants/config.constant';
import { GOOGLE_OAUTH_GUARD } from 'src/common/constants/guards.constant';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { OauthPayload } from 'src/common/interface/oauth-payload';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_OAUTH_GUARD) {
  // TODO: configService never used 에러 해결
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>(OAUTH_GOOGLE_ID),
      clientSecret: configService.get<string>(OAUTH_GOOGLE_SECRET),
      callbackURL: configService.get<string>(OAUTH_GOOGLE_CALLBACK),
      scope: ['email', 'profile'],
    });
  }

  // TODO: 사용되지 않는 매개 변수 에러 해결
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    
    const oauthPayload: OauthPayload = {
      provider: UserProvider.GOOGLE,
      providerId: id,
      name: name!.givenName,
      email: emails![0].value,
      picture: photos![0].value,      
    }

    const user = await this.usersService.findByProviderIdOrSave(oauthPayload);

    if (!user) {
      throw new UnauthorizedException(UnauthorizedUser.message, UnauthorizedUser.name);
    }

    return user;
  }
}