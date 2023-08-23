import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from './entity/user.entity'
import { UserNotExist } from "src/common/exception/error-types";
@Injectable()
export class TypeormUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {

  }
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }});

    if(!user) {
      throw new NotFoundException(UserNotExist.message, UserNotExist.name);
    }

    return user;
  }
}