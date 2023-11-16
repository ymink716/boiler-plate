import { ApiProperty } from '@nestjs/swagger';
import { CommentLike } from 'src/likes/entity/comment-like.entity';
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
  OneToMany,
} from 'typeorm';
import Content from '../vo/content';

@Entity()
export class Comment {
  constructor(options: {
    content: Content;
    writer: User;
    question: Question;
  }) {
    if (options) {
      this.content = options.content;
      this.writer = options.writer;
      this.question = options.question;
    }
  }

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column(() => Content, { prefix: false })
  content: Content;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @ApiProperty()
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

  @OneToMany(() => CommentLike, commentLike => commentLike.comment)
  likes: CommentLike[];
}
