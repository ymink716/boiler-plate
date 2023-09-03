import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { QuestionLikesRepository } from './question-likes.repository';
import { QuestionsService } from 'src/questions/questions.service';
import { QuestionsAlreadyLiked } from 'src/common/exception/error-types';
import { QuestionLike } from './entity/question-like.entity';
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
      throw new BadRequestException(QuestionsAlreadyLiked.message, QuestionsAlreadyLiked.name);
    }

    const questionLike = new QuestionLike({ question, user });

    await this.questionLikesRepository.save(questionLike);
  }

  async unlikeQuestion(questionId: number, userId: number): Promise<void> {
    const questionLikes = await this.questionLikesRepository.findByUserIdAndQeustionId(userId, questionId);

    questionLikes.forEach(
      async (questionLike) => await this.questionLikesRepository.delete(questionLike.id)
    );
  }

  async uplikeComment(commentId: number, user: User) {

  }
}
