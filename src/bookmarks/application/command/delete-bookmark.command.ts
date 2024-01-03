import { ICommand } from "@nestjs/cqrs";

export class DeleteBookmarkCommand implements ICommand {
  constructor(
    readonly questionId: number,
    readonly userId: number,
  ) {}
}