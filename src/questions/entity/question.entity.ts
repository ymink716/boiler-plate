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
import { Content } from '../vo/content';
import { Title } from '../vo/title';


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
  @Column(() => Title)
  title: Title;

  @ApiProperty()
  @Column(() => Content)
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
}
