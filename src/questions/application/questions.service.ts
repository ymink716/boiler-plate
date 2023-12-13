import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from '../presentation/dto/create-question.dto';
import { QuestionsRepository } from '../domain/repository/questions.repository';
import { QuestionNotFound } from 'src/common/exception/error-types';
import { UpdateQuestionDto } from '../presentation/dto/update-question.dto';
import { QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Title } from '../domain/title';
import { Content } from '../domain/content';
import { Question } from '../domain/question';
import { User } from 'src/users/domain/user';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject(QUESTIONS_REPOSITORY)
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  public async getQuestions(): Promise<FidnOn[]> {
    return await this.questionQueryRepository._____();
    // return await this.questionsRepository.findAll();
  }

  public async getQuestion(questionId: number): Promise<Question> {
    const question = await this.questionsRepository.findOneById(questionId);

    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    return question;
  }
}
