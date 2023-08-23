import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { VerifiedCallback } from 'passport-jwt';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { OauthPayload } from 'src/common/interface/oauth-payload';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('OAUTH_GOOGLE_ID'),
      clientSecret: configService.get<string>('OAUTH_GOOGLE_SECRET'),
      callbackURL: configService.get<string>('OAUTH_GOOGLE_CALLBACK'),
      scope: ['email', 'profile'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    
    return {
      provider: UserProvider.GOOGLE,
      providerId: id,
      name: name!.givenName,
      email: emails![0].value,
      picture: photos![0].value,      
    }
  }
}