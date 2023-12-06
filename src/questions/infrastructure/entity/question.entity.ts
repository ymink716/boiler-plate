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
import { Content } from '../../domain/vo/content';
import { Title } from '../../domain/vo/title';

@Entity('question')
export class QuestionEntity {
  constructor(options: {
    title: Title;
    content: Content;
    writer: User;
    comments: Comment[];
    likes: QuestionLike[];
    bookmarks: Bookmark[];
  }) {
    if (options) {
      this.title = options.title;
      this.content = options.content;
      this.writer = options.writer;
      this.comments = options.comments;
      this.likes = options.likes;
      this.bookmarks = options.bookmarks;
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
}
