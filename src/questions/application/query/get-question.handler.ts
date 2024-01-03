import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetQuestionQuery } from './get-question.query';
import { QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { QuestionNotFound } from 'src/common/exception/error-types';
import { ResponseQuestionDto } from 'src/questions/presentation/dto/response-question.dto';
import { TypeormQuestionsQueryRepository } from 'src/questions/infrastructure/typeorm-questions-query.repository';

@Injectable()
@QueryHandler(GetQuestionQuery)
export class GetQuestionHandler implements IQueryHandler<GetQuestionQuery> {
  constructor(
    private readonly questionsQeuryRepository: TypeormQuestionsQueryRepository,
  ) {}

  async execute(query: GetQuestionQuery): Promise<ResponseQuestionDto> {
    const { questionId } = query;

    const question = await this.questionsQeuryRepository.findOneById(questionId);
    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    return new ResponseQuestionDto(question);
  }
}