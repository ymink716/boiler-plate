import { ICommand } from "@nestjs/cqrs";

export class UnlikeCommentCommand implements ICommand {
  constructor(
    readonly commentId: number,
    readonly userId: number,
  ) {}
}