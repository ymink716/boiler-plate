import { IQuery } from '@nestjs/cqrs';

export class GetQuestionsQuery implements IQuery {
  constructor(
    readonly search: string,
    readonly page: number,
    readonly take: number,
  ) {}
}