import { UserProvider } from "src/common/enums/user-provider.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {

  constructor(options: {
    email: string;
    provider: UserProvider;
    providerId: string;
    name: string;
    picture: string;
  }) {
    if (options) {
      this.email = options.email;
      this.provider = options.provider;
      this.providerId = options.providerId;
      this.name = options.name;
      this.picture = options.picture;
    }
  }

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
  picture: string;

  @Column({ 
    type: String,
    unique: true,
    nullable: true, 
  })
  hashedRefreshToken: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}