import { ICommand } from "@nestjs/cqrs";

export class EditCommentCommand implements ICommand {
  constructor(
    readonly commentId: number,
    readonly content: string,
    readonly userId: number,
  ) {}
}