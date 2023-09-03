import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { QuestionLikesRepository } from './question-likes.repository';
import { QuestionsService } from 'src/questions/questions.service';
import { CommentAlreadyLiked, QuestionAlreadyLiked } from 'src/common/exception/error-types';
import { CommentLikesRepository } from './comment-likes.repository';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class LikesService {
  constructor(
    @Inject('QUESTION_LIKES_REPOSITORY')
    private readonly questionLikesRepository: QuestionLikesRepository,
    private readonly questionsService: QuestionsService,
    @Inject('COMMENT_LIKES_REPOSITORY')
    private readonly commentLikesRepository: CommentLikesRepository,
    private readonly commentsService: CommentsService,
  ) {}

  async uplikeQuestion(questionId: number, user: User): Promise<void> {
    const question = await this.questionsService.getQuestion(questionId);
    
    const userId = user.id;
    const questionLikesCount = await this.questionLikesRepository.count(userId, questionId);

    if (questionLikesCount > 0) {
      throw new BadRequestException(QuestionAlreadyLiked.message, QuestionAlreadyLiked.name);
    }

    await this.questionLikesRepository.save(user, question);
  }

  async unlikeQuestion(questionId: number, userId: number): Promise<void> {
    const questionLikes = await this.questionLikesRepository.findByUserIdAndQeustionId(userId, questionId);

    questionLikes.forEach(
      async (questionLike) => await this.questionLikesRepository.delete(questionLike.id)
    );
  }

  async uplikeComment(commentId: number, user: User): Promise<void> {
    const comment = await this.commentsService.findComment(commentId);

    const userId = user.id;
    const commentLikesCount = await this.questionLikesRepository.count(userId, commentId);

    if (commentLikesCount > 0) {
      throw new BadRequestException(CommentAlreadyLiked.message, CommentAlreadyLiked.name);
    }

    await this.commentLikesRepository.save(user, comment);
  }

  async unlikeComment(commentId: number, userId: number): Promise<void> {
    const commentLikes = await this.commentLikesRepository.findByUserIdAndCommentId(userId, commentId);

    commentLikes.forEach(
      async (commentLike) => await this.commentLikesRepository.delete(commentLike.id)
    );
  }
}
