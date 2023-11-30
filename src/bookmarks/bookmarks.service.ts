import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { QuestionsService } from 'src/questions/questions.service';
import { User } from 'src/users/entity/user.entity';
import { QuestionAlreadyBookmarked } from 'src/common/exception/error-types';
import { BookmarksRepository } from './repository/bookmarks.repository';
import { BOOKMARKS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Bookmark } from './entity/bookmark.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @Inject(BOOKMARKS_REPOSITORY)
    private readonly bookmarksRepository: BookmarksRepository,
    private readonly questionsService: QuestionsService,
  ) {}

  public async addBookmark(user: User, questionId: number): Promise<void> {
    const question = await this.questionsService.getQuestion(questionId);

    const userId = user.id;
    const bookmarksCount = await this.bookmarksRepository.countByUserIdAndQuestionId(userId, questionId);

    if (bookmarksCount > 0) {
      throw new BadRequestException(QuestionAlreadyBookmarked.message, QuestionAlreadyBookmarked.name);
    }

    const bookmark = new Bookmark({ user, question });
    await this.bookmarksRepository.save(bookmark);
  }


  public async deleteBookmark(userId: number, questionId: number): Promise<void> {
    const bookmarks = await this.bookmarksRepository.findByUserIdAndQuestionId(userId, questionId);

    await this.bookmarksRepository.revmove(bookmarks);
  }
}
