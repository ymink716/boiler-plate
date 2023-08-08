import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('OAUTH_GOOGLE_ID'),
      clientSecret: configService.get<string>('OAUTH_GOOGLE_SECRET'),
      callbackURL: configService.get<string>('OAUTH_GOOGLE_REDIRECT'),
      scope: ['email', 'profile'],
    })
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ){
    const { id, name, emails } = profile;
  
    return {
      provider: 'google',
      providerId: id,
      name: name!.givenName,
      email: emails![0].value,
    };
  }
}