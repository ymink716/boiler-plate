import { Comment } from 'src/comments/infrastructure/entity/comment.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('comment_like')
export class CommentLikeEntity {
  constructor(options: {
    user: User,
    comment: Comment
  }) {
    if (options) {
      this.user = options.user;
      this.comment = options.comment;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ManyToOne(() => User, user => user.questionLikes, {
    onDelete: 'CASCADE',
    nullable: false
  })
  user: User;

  @ManyToOne(() => Comment, comment => comment.likes, {
    onDelete: 'CASCADE',
    nullable: false
  })
  comment: Comment;
}
