import { User } from "../user";

export interface UsersRepository {
  findOneById(id: number): Promise<User | null>;
  findByProviderId(providerId: string): Promise<User | null>;
  save(user: User): Promise<User>;
}