import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { QuestionLikesRepository } from './question-likes.repository';

@Injectable()
export class LikesService {
  constructor(
    @Inject('QUESTION_LIKES_REPOSITORY')
    private readonly questionLikesRepository: QuestionLikesRepository
  ) {}
  
  uplikeQuestion(questionId: number, user: User) {
    throw new Error('Method not implemented.');
  }

  unlikeQuestion(questionId: number, user: User) {
    throw new Error('Method not implemented.');
  }
}
