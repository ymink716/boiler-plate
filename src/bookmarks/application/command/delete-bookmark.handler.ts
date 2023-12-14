import { ICommandHandler } from "@nestjs/cqrs";
import { Inject, Injectable } from "@nestjs/common";
import { BookmarksRepository } from "src/bookmarks/domain/repository/bookmarks.repository";
import { BOOKMARKS_REPOSITORY } from "src/common/constants/tokens.constant";
import { DeleteBookmarkCommand } from "./delete-bookmark.command";

@Injectable()
export class DeleteBookmarkHandler implements ICommandHandler<DeleteBookmarkCommand> {
  constructor(
    @Inject(BOOKMARKS_REPOSITORY)
    private readonly bookmarksRepository: BookmarksRepository,
  ) {}
  
  async execute(command: DeleteBookmarkCommand) {
    const { userId, questionId } = command;

    const bookmarks = await this.bookmarksRepository.findByUserIdAndQuestionId(userId, questionId);

    await this.bookmarksRepository.remove(bookmarks);
  }
}