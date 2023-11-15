import { User } from 'src/users/entity/user.entity';
import { Comment } from '../entity/comment.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { IsNotCommentor } from 'src/common/exception/error-types';

@Injectable()
export class CommentorCheckService {

  public checkCommentor(comment: Comment, user: User) {
    const writerId = comment.writer.id;
    const userId = user.id;

    if (writerId !== userId) {
      throw new ForbiddenException(IsNotCommentor.message, IsNotCommentor.name);
    }
  }
}