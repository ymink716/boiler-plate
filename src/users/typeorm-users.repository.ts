import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from './entity/user.entity';

@Injectable()
export class TypeormUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneById(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id }});

    return user;
  }

  async findByProviderId(providerId: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { providerId }});

    return user;
  }

  async save(user: User): Promise<User> {
    const savedUser = await this.usersRepository.save(user);

    return savedUser;
  }
}