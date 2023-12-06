import { CommentEntity } from 'src/comments/infrastructure/entity/comment.entity';
import { UserEntity } from 'src/users/infrastructure/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('comment_like')
export class CommentLikeEntity {
  // constructor(options: {
  //   user: User,
  //   comment: CommentEntity
  // }) {
  //   if (options) {
  //     this.user = options.user;
  //     this.comment = options.comment;
  //   }
  // }

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

  @ManyToOne(() => CommentEntity, comment => comment.likes, {
    onDelete: 'CASCADE',
    nullable: false
  })
  comment: CommentEntity;
}
