import { IQuery } from '@nestjs/cqrs';

export class GetQuestionQuery implements IQuery {
  constructor(readonly questionId: number) {}
}