import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InvalidToken, UserNotExist } from '../../common/exception/error-types';
import { OauthPayload } from 'src/common/interface/oauth-payload';
import { UsersRepository } from '../domain/repository/users.repository';
import { USERS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { User } from '../domain/user';
import { Profile } from '../domain/profile';
import { Provider } from '../domain/provider';
import { UserProvider } from 'src/common/enums/user-provider.enum';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}
  
  // public async findByProviderIdOrSave(payload: OauthPayload) {
  //   const { providerId, email, name, providerType, picture } = payload;

  //   const existedUser = await this.usersRepository.findByProviderId(providerId);

  //   if (existedUser) {
  //     return existedUser;
  //   }
    
  //   const profile = new Profile({ email, nickname: name });
  //   const provider = new Provider({ providerType, providerId });
  //   const user = new User({ profile, provider });
    
  //   return await this.usersRepository.save(user);
  // }

  public async register(providerId: string, email: string, providerType: UserProvider) {
    const nickname = 'tester';

    const profile = new Profile({ email, nickname });
    const provider = new Provider({ providerType, providerId });
    const user = new User({ profile, provider });
    
    return await this.usersRepository.save(user);
  }
  
  public async updateRefreshToken(id: number, refreshToken: string) {    
    const user = await this.usersRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(UserNotExist.message, UserNotExist.name);
    }

    user.updateRefreshToken(refreshToken);
    await this.usersRepository.save(user);
  }

  public async getUserIfRefreshTokenisMatched(refreshToken: string, userId: number) {
    const user = await this.usersRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException(UserNotExist.message, UserNotExist.name);
    }

    if (!user.isMatchedRefreshToken(refreshToken)) {
      throw new UnauthorizedException(InvalidToken.message, InvalidToken.name);
    }
    
    return user;
  }

  public async removeRefreshToken(id: number) {
    const user = await this.usersRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(UserNotExist.message, UserNotExist.name);
    }
    
    user.updateRefreshToken(null);
    await this.usersRepository.save(user);
  }

  public async findUserById(userId: number) {
    const user = await this.usersRepository.findOneById(userId);

    return user;
  }

  public async findUserByProviderId(providerId: string) {
    const user = await this.usersRepository.findByProviderId(providerId);

    return user;
  }
}