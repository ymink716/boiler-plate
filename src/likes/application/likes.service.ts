import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { QuestionLikesRepository } from '../domain/repository/question-likes.repository';
import { QuestionsService } from 'src/questions/application/questions.service';
import { CommentAlreadyLiked, QuestionAlreadyLiked } from 'src/common/exception/error-types';
import { CommentLikesRepository } from '../domain/repository/comment-likes.repository';
import { CommentsService } from 'src/comments/application/comments.service';
import { COMMENT_LIKES_REPOSITORY, QUESTION_LIKES_REPOSITORY } from 'src/common/constants/tokens.constant';
import { QuestionLike } from '../domain/question.like';
import { CommentLike } from '../domain/comment.like';
import { User } from 'src/users/domain/user';

@Injectable()
export class LikesService {
  constructor(
    @Inject(QUESTION_LIKES_REPOSITORY)
    private readonly questionLikesRepository: QuestionLikesRepository,
    private readonly questionsService: QuestionsService,
    @Inject(COMMENT_LIKES_REPOSITORY)
    private readonly commentLikesRepository: CommentLikesRepository,
    private readonly commentsService: CommentsService,
  ) {}
  
  async unlikeQuestion(questionId: number, userId: number): Promise<void> {
    const questionLikes = await this.questionLikesRepository.findByUserIdAndQeustionId(userId, questionId);

    await this.questionLikesRepository.remove(questionLikes);
  }

  async uplikeComment(commentId: number, user: User): Promise<void> {
    const comment = await this.commentsService.getComment(commentId);

    const userId = user.getId();
    const commentLikesCount = await this.commentLikesRepository.count(userId, commentId);

    if (commentLikesCount > 0) {
      throw new BadRequestException(CommentAlreadyLiked.message, CommentAlreadyLiked.name);
    }

    const commentLike = new CommentLike({ 
      commentId: comment.getId(), 
      userId: user.getId() 
    });
    
    await this.commentLikesRepository.save(commentLike);
  }

  async unlikeComment(commentId: number, userId: number): Promise<void> {
    const commentLikes = await this.commentLikesRepository.findByUserIdAndCommentId(userId, commentId);

    await this.commentLikesRepository.remove(commentLikes);
  }
}
