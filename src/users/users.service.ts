import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { TokenHasExpired, UserNotExist } from '../common/exception/error-types';
import { OauthPayload } from 'src/common/interface/oauth-payload';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
,   @Inject('USERS_REPOSITORY')
    private readonly usersRepository: UsersRepository
  ) {}
  
  async findByProviderIdOrSave(payload: OauthPayload) {
    const { providerId, email, name, provider, picture } = payload;

    const existedUser = await this.userRepository.findOne({ where: { providerId }});

    if (existedUser) {
      return existedUser;
    }

    const newUser = new User({ provider, providerId, name, picture, email });

    await this.userRepository.save(newUser);

    return newUser;
  }

  async updateHashedRefreshToken(id: number, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    
    const user = await this.findUserById(id);

    user.hashedRefreshToken = hashedRefreshToken;
    
    await this.userRepository.save(user);
  }

  async getUserIfRefreshTokenisMatched(refreshToken: string, userId: number) {
    const user = await this.findUserById(userId);
    
    await this.checkRefreshToken(refreshToken, user.hashedRefreshToken);
    
    return user;
  }

  async checkRefreshToken(clientToken: string, savedToken: string | null) {
    const isRefreshTokenMatched = await bcrypt.compare(clientToken, savedToken);

    if (!isRefreshTokenMatched) { 
      throw new UnauthorizedException(TokenHasExpired.message, TokenHasExpired.name);
    }
  }

  // TODO: update -> save
  async removeRefreshToken(id: number) {
    await this.userRepository.update(id, {
      hashedRefreshToken: null,
    });
  }

  // TODO: 레파지토리로 이동
  async findUserById(id: number) {
    const user = await this.usersRepository.findOneById(id);

    // if (!user) {
    //   throw new NotFoundException(UserNotExist.message, UserNotExist.name);
    // }

    return user;
  }
}