import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { ResponseQuestionDto } from 'src/questions/presentation/dto/response-question.dto';
import { TypeormQuestionsQueryRepository } from 'src/questions/infrastructure/typeorm-questions-query.repository';
import { GetQuestionsQuery } from './get-questions.query';

@Injectable()
@QueryHandler(GetQuestionsQuery)
export class GetQuestionsHandler implements IQueryHandler<GetQuestionsQuery> {
  constructor(
    private readonly questionsQeuryRepository: TypeormQuestionsQueryRepository,
  ) {}

  async execute(query: GetQuestionsQuery): Promise<ResponseQuestionDto[]> {
    const { search, page, take } = query;

    const questions = await this.questionsQeuryRepository.find(search, page, take);

    return questions.map((question) => new ResponseQuestionDto(question));
  }
}