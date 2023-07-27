import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor() {}
  
  createUser(createUserDto: CreateUserDto) {
    return 'dddd';
  }
}
