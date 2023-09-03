import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { QuestionsService } from 'src/questions/questions.service';
import { User } from 'src/users/entity/user.entity';
import { QuestionAlreadyBookmarked } from 'src/common/exception/error-types';
import { BookmarksRepository } from './bookmarks.repository';

@Injectable()
export class BookmarksService {
  constructor(
    @Inject('BOOKMARKS_REPOSITORY')
    private readonly bookmarksRepository: BookmarksRepository,
    private readonly questionsService: QuestionsService,
  ) {}

  async addBookmark(user: User, questionId: number): Promise<void> {
    const question = await this.questionsService.getQuestion(questionId);

    const userId = user.id;
    const bookmarksCount = await this.bookmarksRepository.countByUserIdAndQuestionId(userId, questionId);

    if (bookmarksCount > 0) {
      throw new BadRequestException(QuestionAlreadyBookmarked.message, QuestionAlreadyBookmarked.name);
    }

    await this.bookmarksRepository.save(user, question);
  }

  async deleteBookmark(userId: number, questionId: number): Promise<void> {
    const bookmarks = await this.bookmarksRepository.findByUserIdAndQuestionId(userId, questionId);

    bookmarks.forEach(
      async (bookmark) => await this.bookmarksRepository.delete(bookmark.id)
    );
  }
}
