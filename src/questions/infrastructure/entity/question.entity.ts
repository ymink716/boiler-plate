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
import { BookmarkEntity } from 'src/bookmarks/infrastructure/entity/bookmark.entity';

@Entity('question')
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'varchar', length: 500 })
  content: string;

  @Column({ type: 'int', default: 0 })
  views: number;

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

  @ManyToOne(type => UserEntity, user => user.questions)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => CommentEntity, comment => comment.question)
  comments: CommentEntity[];

  @OneToMany(() => BookmarkEntity, bookmark => bookmark.question)
  bookmarks: BookmarkEntity[];
}
