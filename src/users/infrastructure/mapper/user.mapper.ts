import { User } from "src/users/domain/user";
import { UserEntity } from "../entity/user.entity";

export class UserMapper {
  public static toDomain(userEntity: UserEntity): User {
    const { id, email, name, provider, providerId, picture, createdAt } = userEntity;

    const user = new User({
      id, email, provider, providerId, picture, createdAt, name,
    });

    return user;
  }

  public static toPersistence(user: User): UserEntity {
    const id = user['id'];
    const email = user['email'];
    const provider = user['provider'];
    const providerId = user['providerId'];
    const name = user['name'];
    const picture = user['picture'];

    const userEntity = new UserEntity();

    if (id) {
      userEntity.id = id;
    }
    userEntity.email = email;
    userEntity.provider = provider;
    userEntity.providerId = providerId;
    userEntity.name = name;
    userEntity.picture = picture;

    return userEntity;
  }
}