import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Bookmark {
  constructor(options: {
    user: User,
    question: Question
  }) {
    if (options) {
      this.user = options.user;
      this.question = options.question;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ManyToOne(() => User, user => user.bookmarks, {
    onDelete: 'CASCADE',
    nullable: false
  })
  user: User;

  @ManyToOne(() => Question, question => question.bookmarks, {
    onDelete: 'CASCADE',
    nullable: false
  })
  question: Question;
}
