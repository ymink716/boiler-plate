import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from '../presentation/dto/create-comment.dto';
import { CommentsRepository } from '../domain/repository/comments.repository';
import { QuestionsService } from 'src/questions/application/questions.service';
import { UpdateCommentDto } from '../presentation/dto/update-comment.dto';
import { CommentNotFound } from 'src/common/exception/error-types';
import { COMMENTS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Content } from '../domain/vo/content';
import { Comment } from '../domain/comment';
import { User } from 'src/users/domain/user';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(COMMENTS_REPOSITORY)
    private readonly commentsRepository: CommentsRepository,
    private readonly questionsService: QuestionsService,
  ) {}

  public async getComment(commentId: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOneById(commentId);
    
    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }

    return comment;
  }
}



