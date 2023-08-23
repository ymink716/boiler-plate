import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from './entity/user.entity';

@Injectable()
export class TypeormUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id }});

    return user;
  }

  async findByProviderId(providerId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { providerId }});

    return user;
  }

  async save(user: User): Promise<User> {
    const newUser = await this.userRepository.save(user);

    return newUser;
  }
}