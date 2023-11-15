import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { InvalidToken, UserNotExist } from '../common/exception/error-types';
import { OauthPayload } from 'src/common/interface/oauth-payload';
import { UsersRepository } from './users.repository';
import { USERS_REPOSITORY } from 'src/common/constants/tokens.constant';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository
  ) {}
  
  async findByProviderIdOrSave(payload: OauthPayload) {
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

  async updateHashedRefreshToken(id: number, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    
    const user = await this.usersRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(UserNotExist.message, UserNotExist.name);
    }

    user.hashedRefreshToken = hashedRefreshToken;
    
    await this.usersRepository.save(user);
  }

  async getUserIfRefreshTokenisMatched(refreshToken: string, userId: number) {
    const user = await this.usersRepository.findOneById(userId);
    
    if (!user) {
      throw new NotFoundException(UserNotExist.message, UserNotExist.name);
    }

    await this.checkRefreshToken(refreshToken, user.hashedRefreshToken);
    
    return user;
  }

  async checkRefreshToken(clientToken: string, savedToken: string | null) {
    const isRefreshTokenMatched = await bcrypt.compare(clientToken, savedToken);

    if (!isRefreshTokenMatched) { 
      throw new UnauthorizedException(InvalidToken.message, InvalidToken.name);
    }
  }

  async removeRefreshToken(id: number) {
    const user = await this.usersRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(UserNotExist.message, UserNotExist.name);
    }
    
    user.hashedRefreshToken = null;
    
    await this.usersRepository.save(user);
  }

  async findUserById(userId: number) {
    const user = await this.usersRepository.findOneById(userId);

    return user;
  }
}