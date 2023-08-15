import { UserProvider } from "src/common/enum/user-provider.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: UserProvider })
  provider: UserProvider;

  @Column()
  providerId: string;

  @Column()
  name: string;

  @Column()
  hashedRefreshToken: string;
}