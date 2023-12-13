import { ICommand } from "@nestjs/cqrs";

export class PostQuestionCommand implements ICommand {
  constructor(
    readonly title: string,
    readonly content: string,
    readonly userId: number,
  ) {}
}