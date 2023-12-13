import { ICommand } from "@nestjs/cqrs";

export class UpdateQuestionCommand implements ICommand {
  constructor(
    readonly questionId: number,
    readonly title: string,
    readonly content: string,
    readonly userId: number,
  ) {}
}