import { ICommand } from "@nestjs/cqrs";

export class UplikeCommentCommand implements ICommand {
  constructor(
    readonly commentId: number,
    readonly userId: number,
  ) {}
}