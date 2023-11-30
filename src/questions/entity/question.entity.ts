import { User } from 'src/users/entity/user.entity';
import { Comment } from 'src/comments/entity/comment.entity';
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
import { QuestionLike } from 'src/likes/entity/question-like.entity';
import { Bookmark } from 'src/bookmarks/entity/bookmark.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Content } from '../domain/vo/content';
import { Title } from '../domain/vo/title';
import { ForbiddenException } from '@nestjs/common';
import { IsNotQuestionWriter } from 'src/common/exception/error-types';


@Entity()
export class Question {
  constructor(options: {
    title: Title;
    content: Content;
    writer: User,
  }) {
    if (options) {
      this.title = options.title;
      this.content = options.content;
      this.writer = options.writer;
    }
  }

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column(() => Title, { prefix: false })
  title: Title;

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

  @DeleteDateColumn({ 
    type: 'timestamp', 
    nullable: true 
  })
  deletedAt: Date;

  @ManyToOne(() => User, writer => writer.questions)
  writer: User;

  @OneToMany(() => Comment, comment => comment.question)
  comments: Comment[];

  @OneToMany(() => QuestionLike, questionLike => questionLike.question)
  likes: QuestionLike[];

  @OneToMany(() => Bookmark, bookmark => bookmark.question)
  bookmarks: Bookmark[];

  public checkIsAuthor(user: User): void {
    const writerId = this.writer.id;
    const userId = user.id;

    if (writerId !== userId) {
      throw new ForbiddenException(IsNotQuestionWriter.message, IsNotQuestionWriter.name);
    }
  }

  public update(title: string, content: string): void {
    this.title = new Title(title);
    this.content = new Content(content);
  }
}
