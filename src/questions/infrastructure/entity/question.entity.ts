import { UserEntity } from 'src/users/infrastructure/entity/user.entity';
import { CommentEntity } from 'src/comments/infrastructure/entity/comment.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { QuestionLikeEntity } from 'src/likes/infrastructure/entity/question-like.entity';
import { BookmarkEntity } from 'src/bookmarks/infrastructure/entity/bookmark.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('question')
export class QuestionEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

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

  @ManyToOne(type => UserEntity, user => user.questions)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => CommentEntity, comment => comment.question)
  comments: CommentEntity[];

  @OneToMany(() => QuestionLikeEntity, questionLike => questionLike.question)
  likes: QuestionLikeEntity[];

  @OneToMany(() => BookmarkEntity, bookmark => bookmark.question)
  bookmarks: BookmarkEntity[];
}
