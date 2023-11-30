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
import Content from '../domain/vo/content';
import { ForbiddenException } from '@nestjs/common';
import { IsNotCommentor } from 'src/common/exception/error-types';

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
  private content: Content;

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

  public checkCommentor(user: User): void {
    const commentorId = this.writer.getId();
    const userId = user.getId();

    if (commentorId !== userId) {
      throw new ForbiddenException(IsNotCommentor.message, IsNotCommentor.name);
    }
  }

  public editContent(content: string) {
    this.content = new Content(content);
  }
}
