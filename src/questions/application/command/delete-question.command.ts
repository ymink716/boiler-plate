import { ICommand } from "@nestjs/cqrs";

export class DeleteQuestionCommand implements ICommand {
  constructor(
    readonly questionId: number,
    readonly userId: number,
  ) {}
}