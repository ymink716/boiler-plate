import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { QuestionsService } from 'src/questions/application/questions.service';
import { QuestionAlreadyBookmarked } from 'src/common/exception/error-types';
import { BookmarksRepository } from '../domain/repository/bookmarks.repository'; 
import { BOOKMARKS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Bookmark } from '../domain/bookmark';

@Injectable()
export class BookmarksService {
  constructor(
    @Inject(BOOKMARKS_REPOSITORY)
    private readonly bookmarksRepository: BookmarksRepository,
    private readonly questionsService: QuestionsService,
  ) {}

  public async addBookmark(userId: number, questionId: number): Promise<void> {
    await this.questionsService.getQuestion(questionId);
    const bookmarksCount = await this.bookmarksRepository.countByUserIdAndQuestionId(userId, questionId);

    if (bookmarksCount > 0) {
      throw new BadRequestException(QuestionAlreadyBookmarked.message, QuestionAlreadyBookmarked.name);
    }

    const bookmark = new Bookmark({ userId, questionId });
    await this.bookmarksRepository.save(bookmark);
  }


  public async deleteBookmark(userId: number, questionId: number): Promise<void> {
    const bookmarks = await this.bookmarksRepository.findByUserIdAndQuestionId(userId, questionId);

    await this.bookmarksRepository.remove(bookmarks);
  }
}