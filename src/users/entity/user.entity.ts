import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  provider: string;

  @Column()
  providerId: string;

  @Column()
  name: string;

  @Column()
  hashedRefreshToken: string;
}