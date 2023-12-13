import { QuestionEntity } from 'src/questions/infrastructure/entity/question.entity';
import { UserEntity } from 'src/users/infrastructure/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('question_like')
export class QuestionLikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ManyToOne(() => UserEntity, user => user.questionLikes, {
    onDelete: 'CASCADE',
    nullable: false
  })
  user: UserEntity;

  @ManyToOne(() => QuestionEntity, question => question.likes, {
    onDelete: 'CASCADE',
    nullable: false
  })
  question: QuestionEntity;
}
