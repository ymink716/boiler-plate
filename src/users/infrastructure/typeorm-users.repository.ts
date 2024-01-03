import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../domain/repository/users.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { User } from "../domain/user";
import { UserMapper } from "./mapper/user.mapper";

@Injectable()
export class TypeormUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneById(id: number): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { id }});

    if (!userEntity) {
      return null;
    }

    return UserMapper.toDomain(userEntity);
  }

  async findByProviderId(providerId: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { providerId }});

    if (!userEntity) {
      return null;
    }

    return UserMapper.toDomain(userEntity);
  }

  async save(user: User): Promise<User> {
    const savedUserEntity = await this.userRepository.save(
      UserMapper.toPersistence(user),
    );

    return UserMapper.toDomain(savedUserEntity);
  }
}