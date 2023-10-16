import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from "typeorm"
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { Question } from 'src/questions/entity/question.entity';
import { BookmarksRepository } from '../bookmarks.repository';
import { Bookmark } from '../entity/bookmark.entity';

describe('BookmarksRepository', () => {
  let app: INestApplication;
  let bookmarksRepository: BookmarksRepository;
  let dataSource: DataSource;

  let user: User;
  let question: Question;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    bookmarksRepository = app.get<BookmarksRepository>('BOOKMARKS_REPOSITORY');
    dataSource = app.get<DataSource>(DataSource);

    setUpTestingAppModule(app);
    
    await app.init();

    user = new User({ 
      email: 'test@email.com',
      provider: UserProvider.GOOGLE,
      providerId: "providerId",
      name: "tester",
      picture: "pictureURL",
    });

    question = new Question({
      title: "test",
      content: "test content...",
      writer: user,
    });

    await dataSource.manager.save(user);
    await dataSource.manager.save(question);
  });

  beforeEach(async () => {
    await dataSource.manager.delete(Bookmark, {});
  });

  describe('countByUserIdAndQuestionId()', () => {
    test('User Id와 Question Id에 맞는 북마크 수를 리턴한다.', async () => {
      await dataSource.manager.save(Bookmark, new Bookmark({ user, question }));

      const result = await bookmarksRepository.countByUserIdAndQuestionId(user.id, question.id);

      expect(result).toBe(1);
    });
  });

  describe('save()', () => {
    test('DB에 북마크 정보를 저장하고, 북마크 entity를 리턴한다.', async () => {
      const result = await bookmarksRepository.save(user, question);

      expect(result).toBeInstanceOf(Bookmark);
      expect(result.user).toBeDefined();
      expect(result.question).toBeDefined();
    });
  });

  describe('findByUserIdAndQuestionId()', () => {
    test('User Id와 Question Id에 맞는 북마크를 조회한다.', async () => {
      await dataSource.manager.save(new Bookmark({ user, question }));

      const result = await bookmarksRepository.findByUserIdAndQuestionId(user.id, question.id);

      expect(result.length).toBe(1);
      expect(result[0]).toBeInstanceOf(Bookmark);
    });
  });

  describe('delete()', () => {
    test('해당 북마크를 삭제한다.', async () => {
      const bookmark = await dataSource.manager.save(new Bookmark({ user, question }));

      await bookmarksRepository.delete(bookmark.id);

      const result = await dataSource.manager.find(Bookmark);
      expect(result.length).toBe(0);
    });
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
});
