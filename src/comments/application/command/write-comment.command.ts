import { ICommand } from "@nestjs/cqrs";

export class WriteCommentCommand implements ICommand {
  constructor(
    readonly questionId: number,
    readonly content: string,
    readonly userId: number,
  ) {}
}