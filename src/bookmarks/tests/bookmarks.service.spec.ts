import { BookmarksService } from '../application/bookmarks.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication } from '@nestjs/common';
import { Question } from 'src/questions/infrastructure/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { QuestionsService } from 'src/questions/application/questions.service';
import { BookmarksRepository } from '../repository/bookmarks.repository';
import { Bookmark } from '../infrastructure/entity/bookmark.entity';
import { BOOKMARKS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Title } from 'src/questions/domain/vo/title';
import { Content } from 'src/questions/domain/vo/content';

describe('BookmarksService', () => {
  let app: INestApplication;

  let bookmarksService: BookmarksService;
  let bookmarksRepository: BookmarksRepository;
  let questionsService: QuestionsService;

  let user: User;
  let question: Question;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();

    bookmarksService = app.get<BookmarksService>(BookmarksService);
    bookmarksRepository = app.get<BookmarksRepository>(BOOKMARKS_REPOSITORY);
    questionsService = app.get<QuestionsService>(QuestionsService);

    setUpTestingAppModule(app);
    
    await app.init();

    user = { id: 1 } as User;
    question = {
      id: 1,
      title: new Title("test"),
      content: new Content("test question content..."),
      writer: user,
    } as Question;
  });

  describe('addBookmark()', () => {
    test('북마크 정보를 DB에 저장하기 위한 메서드를 호출한다.', async () => {
      const bookmark = new Bookmark({ user, question });

      jest.spyOn(questionsService, 'getQuestion').mockResolvedValue(question);
      jest.spyOn(bookmarksRepository, 'countByUserIdAndQuestionId').mockResolvedValue(0);
      jest.spyOn(bookmarksRepository, 'save').mockResolvedValue(bookmark);

      const result = await bookmarksService.addBookmark(user, question.id);

      expect(result).toBeUndefined();
      expect(bookmarksRepository.save).toBeCalled();
    });

    test('이미 북마크했다면, BadRequestException이 발생한다.', async () => {
      jest.spyOn(questionsService, 'getQuestion').mockResolvedValue(question);
      jest.spyOn(bookmarksRepository, 'countByUserIdAndQuestionId').mockResolvedValue(1);

      await expect(
        bookmarksService.addBookmark(user, question.id)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteBookmark()', () => {
    test('북마크 정보를 삭제하는 DB 접근 로직을 실행한다.', async () => {
      const bookmarks = [new Bookmark({ user, question })];

      jest.spyOn(bookmarksRepository, 'findByUserIdAndQuestionId').mockResolvedValue(bookmarks);
      jest.spyOn(bookmarksRepository, 'remove').mockResolvedValue(undefined);

      const result = await bookmarksService.deleteBookmark(user.id, question.id);

      expect(result).toBeUndefined();
      expect(bookmarksRepository.remove).toBeCalledTimes(1);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
