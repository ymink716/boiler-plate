import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InvalidToken, UserNotExist } from '../common/exception/error-types';
import { OauthPayload } from 'src/common/interface/oauth-payload';
import { UsersRepository } from './repository/users.repository';
import { USERS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Hash } from 'src/common/interface/hash';
import { BcryptHash } from 'src/common/utils/bcrypt-hash';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    private readonly hash: Hash,
  ) {
    this.hash = new BcryptHash();
  }
  
  public async findByProviderIdOrSave(payload: OauthPayload) {
    const { providerId, email, name, provider, picture } = payload;

    const existedUser = await this.usersRepository.findByProviderId(providerId);

    if (existedUser) {
      return existedUser;
    }
     
    const newUser = await this.usersRepository.save(new User({ 
      provider, providerId, name, picture, email 
    }));

    return newUser;
  }

  public async updateHashedRefreshToken(id: number, refreshToken: string) {    
    const user = await this.usersRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(UserNotExist.message, UserNotExist.name);
    }

    const hashedRefreshToken = await this.hash.generate(refreshToken);
    user.hashedRefreshToken = hashedRefreshToken;
    
    await this.usersRepository.save(user);
  }

  public async getUserIfRefreshTokenisMatched(refreshToken: string, userId: number) {
    const user = await this.usersRepository.findOneById(userId);
    
    if (!user) {
      throw new NotFoundException(UserNotExist.message, UserNotExist.name);
    }
    await this.checkRefreshToken(refreshToken, user.hashedRefreshToken);
    
    return user;
  }

  private async checkRefreshToken(clientToken: string, savedToken: string | null) {
    const isRefreshTokenMatched = await this.hash.compare(clientToken, savedToken);

    if (!isRefreshTokenMatched) { 
      throw new UnauthorizedException(InvalidToken.message, InvalidToken.name);
    }
  }

  public async removeRefreshToken(id: number) {
    const user = await this.usersRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(UserNotExist.message, UserNotExist.name);
    }
    
    user.hashedRefreshToken = null;
    await this.usersRepository.save(user);
  }

  public async findUserById(userId: number) {
    const user = await this.usersRepository.findOneById(userId);

    return user;
  }
}