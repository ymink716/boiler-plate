import { ICommand } from "@nestjs/cqrs";

export class UplikeQuestionCommand implements ICommand {
  constructor(
    readonly questionId: number,
    readonly userId: number,
  ) {}
}