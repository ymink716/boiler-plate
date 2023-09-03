import { Bookmark } from "src/bookmarks/entity/bookmark.entity";
import { UserProvider } from "src/common/enums/user-provider.enum";
import { QuestionLike } from "src/likes/entity/question-like.entity";
import { Question } from "src/questions/entity/question.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @OneToMany(() => Question, question => question.writer)
  questions: Question[];

  @OneToMany(() => QuestionLike, questionLike => questionLike.user)
  questionLikes: QuestionLike[];

  @OneToMany(() => Bookmark, bookmark => bookmark.user)
  bookmarks: Bookmark[];
}