import { Comment } from 'src/comments/infrastructure/entity/comment.entity';
import { User } from 'src/users/entity/user.entity';

export class CommentLike {
  constructor(options: {
    user: User,
    comment: Comment
  }) {
    if (options) {
      this.user = options.user;
      this.comment = options.comment;
    }
  }

  private id: number;

  private createdAt: Date;

  private user: User;

  private comment: Comment;
}
