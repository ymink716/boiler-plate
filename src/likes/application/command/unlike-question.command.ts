import { ICommand } from "@nestjs/cqrs";

export class UnlikeQuestionCommand implements ICommand {
  constructor(
    readonly questionId: number,
    readonly userId: number,
  ) {}
}