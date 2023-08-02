import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) {}
  
  createUser(createUserDto: CreateUserDto) {
    return 'dddd';
  }

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
}
