import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { QuestionNotFound } from 'src/common/exception/error-types';
import { ResponseQuestionDto } from 'src/questions/presentation/dto/response-question.dto';
import { TypeormQuestionsQueryRepository } from 'src/questions/infrastructure/typeorm-questions-query.repository';
import { GetQuestionsQuery } from './get-questions.query';

@QueryHandler(GetQuestionsQuery)
export class GetQuestionsHandler implements IQueryHandler<GetQuestionsQuery> {
  constructor(
    @Inject(QUESTIONS_REPOSITORY)
    private readonly questionsQeuryRepository: TypeormQuestionsQueryRepository,
  ) {}

  async execute(query: GetQuestionsQuery): Promise<ResponseQuestionDto[]> {
    const { search, page, take } = query;

    const questions = await this.questionsQeuryRepository.find(search, page, take);

    return questions.map((question) => new ResponseQuestionDto(question));
  }
}