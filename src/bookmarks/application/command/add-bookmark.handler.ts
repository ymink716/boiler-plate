import { ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { BookmarksRepository } from "src/bookmarks/domain/repository/bookmarks.repository";
import { BOOKMARKS_REPOSITORY } from "src/common/constants/tokens.constant";
import { AddBookmarkCommand } from "./add-bookmark.command";
import { QuestionAlreadyBookmarked } from "src/common/exception/error-types";
import { Bookmark } from "src/bookmarks/domain/bookmark";

@Injectable()
export class AddBookmarkHandler implements ICommandHandler<AddBookmarkCommand> {
  constructor(
    @Inject(BOOKMARKS_REPOSITORY)
    private readonly bookmarksRepository: BookmarksRepository,
  ) {}
  
  async execute(command: AddBookmarkCommand) {
    const { questionId, userId } = command;
    
    const bookmarksCount = await this.bookmarksRepository.countByUserIdAndQuestionId(userId, questionId);
    if (bookmarksCount > 0) {
      throw new BadRequestException(QuestionAlreadyBookmarked.message, QuestionAlreadyBookmarked.name);
    }

    const bookmark = new Bookmark({ userId, questionId });
    
    try {
      await this.bookmarksRepository.save(bookmark);
      return { success: true }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}