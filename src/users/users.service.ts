import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) {}

  async findByGoogleIdOrSave(googleUser: GoogleUser) {
    const { providerId, provider, email, name } = googleUser;

    const user = await this.userRepository.findOne({ where: { providerId }});

    if (user) {
      return user;
    }

    const newUser = new User();
    newUser.provider = provider;
    newUser.providerId = providerId;
    newUser.email = email;
    newUser.name = name;

    await this.userRepository.save(newUser);

    return newUser;
  }

  async updateHashedRefreshToken(id: number, refreshToken: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ hashedRefreshToken })
      .where('id = :id', { id })
      .execute();
  }

  async findByIdAndCheckRefreshToken(sub: number, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: sub }});

    if (!user) {
      throw new NotFoundException('user not found');
    }
    
    const isRefreshTokenMatched = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

    if (!isRefreshTokenMatched) { 
      throw new UnauthorizedException('unauthorized user');
    } 

    return user;
  }
}
