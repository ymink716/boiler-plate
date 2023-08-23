import { User } from "./entity/user.entity";

export interface UsersRepository {
  findOneById(id: number): Promise<User | null>;
}