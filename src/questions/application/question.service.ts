import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsRepository } from '../domain/repository/questions.repository';
import { QuestionNotFound } from 'src/common/exception/error-types';
import { QUESTIONS_QUERY_REPOSITORY, QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Title } from '../domain/title'; 
import { Content } from '../domain/content'; 
import { Question } from '../domain/question';
import { ResponseQuestionDto } from '../presentation/dto/response-question.dto';
import { TypeormQuestionsQueryRepository } from '../infrastructure/typeorm-questions-query.repository';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject(QUESTIONS_REPOSITORY)
    private readonly questionsRepository: QuestionsRepository,
    @Inject(QUESTIONS_QUERY_REPOSITORY)
    private readonly questionsQueryRepository: TypeormQuestionsQueryRepository,
  ) {}

  public async postQuestion(title: string, content: string,userId: number): Promise<Question> {
    const question = new Question({ 
      title: new Title(title), 
      content: new Content(content), 
      userId,
    });
    
    return await this.questionsRepository.save(question);
  }

  public async getQuestion(questionId: number): Promise<ResponseQuestionDto> {
    const question = await this.questionsQueryRepository.findOneById(questionId);
    
    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    return new ResponseQuestionDto(question);
  }

  public async getQuestions(search: string, page: number, take: number): Promise<ResponseQuestionDto[]> {
    const questions = await this.questionsQueryRepository.find(search, page, take);

    return questions.map((question) => new ResponseQuestionDto(question));
  }

  public async updateQuestion(
    questionId: number,
    title: string,
    content: string,
    userId: number,
  ): Promise<Question> {
    const question = await this.questionsRepository.findOneById(questionId);

    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    question.checkIsAuthor(userId);
    question.update(title, content);

    return await this.questionsRepository.save(question);
  }

  public async deleteQuestion(questionId: number, userId: number) {
    const question = await this.questionsRepository.findOneById(questionId);

    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }
    
    question.checkIsAuthor(userId);
    await this.questionsRepository.softDelete(questionId);

    return { success: true }
  }
}