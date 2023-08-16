import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ErrorType } from '../common/exception/error-type';
import { OauthPayload } from 'src/common/interface/oauth-payload';
const { TokenHasExpired, UserNotExist } = ErrorType;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  async findByProviderIdOrSave(payload: OauthPayload) {
    const { providerId, email, name, provider, picture } = payload;

    const existedUser = await this.userRepository.findOne({ where: { providerId }});

    if (existedUser) {
      return existedUser;
    }

    const newUser = new User();
    newUser.provider = provider;
    newUser.providerId = providerId;
    newUser.email = email;
    newUser.name = name;
    newUser.picture = picture;

    await this.userRepository.save(newUser);

    return newUser;
  }

  async updateHashedRefreshToken(id: number, refreshToken: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    
    const user = await this.findUserById(id);

    user.hashedRefreshToken = hashedRefreshToken;
    
    await this.userRepository.save(user);
  }

  async findUserByIdAndRefreshToken(sub: number, refreshToken: string): Promise<User> {
    const user = await this.findUserById(sub);
    
    await this.checkRefreshToken(refreshToken, user.hashedRefreshToken);

    return user;
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }});

    if (!user) {
      throw new NotFoundException(UserNotExist.message, UserNotExist.name);
    }

    return user;
  }

  async checkRefreshToken(clientToken: string, savedToken: string): Promise<void> {
    const isRefreshTokenMatched = await bcrypt.compare(clientToken, savedToken);

    if (!isRefreshTokenMatched) { 
      throw new UnauthorizedException(TokenHasExpired.message, TokenHasExpired.name);
    }
  }
}