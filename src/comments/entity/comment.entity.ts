import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';


@Entity()
export class Comment {
  constructor(options: {
    content: string;
    writer: User,
  }) {
    if (options) {
      this.content = options.content;
      this.writer = options.writer;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'text' })
  content: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn({ 
    type: 'timestamp', 
    nullable: true 
  })
  deletedAt: Date;

  @ManyToOne(() => User, writer => writer.questions)
  writer: User;

  @ManyToOne(() => Question, question => question.comments, {
    onDelete: 'CASCADE',
    nullable: false
  })
  question: Question;
}
