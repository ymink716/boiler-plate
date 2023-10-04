import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { AppModule } from 'src/app.module';
import { CommentsRepository } from '../comments.repository';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { Comment } from '../entity/comment.entity';

describe('CommentsRepository', () => {
  let app: INestApplication;
  let commentsRepository: CommentsRepository;
  let dataSource: DataSource;

  let user: User;
  let question: Question;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    commentsRepository = app.get<CommentsRepository>('COMMENTS_REPOSITORY');
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

  describe('findOneById()', () => {
    test('comment entity를 리턴한다', async () => {
      const comment = await dataSource.manager.save(new Comment({
        content: "test content...",
        writer: user,
        question: question,
      }));

      const result = await commentsRepository.findOneById(comment.id);

      expect(result?.content).toBe("test content...");
    });
  });

  describe('save()', () => {
    test('save된 comment entity를 리턴한다.', async () => {
      const content = "test content...";

      const result = await commentsRepository.save(content, user, question);

      expect(result?.content).toBe("test content...");
    });
  });

  describe('findAll()', () => {
    test('저장된 comment 목록을 전부 조회한다.', async () => {
      const comment1 = await dataSource.manager.save(new Comment({
        content: "test content...1",
        writer: user,
        question: question,
      }));

      const comment2 = await dataSource.manager.save(new Comment({
        content: "test content...2",
        writer: user,
        question:  question,
      }));

      const result = await commentsRepository.findAll();

      expect(result.length).toBe(2);
      expect(result[0].content).toBe(comment1.content);
      expect(result[1].content).toBe(comment2.content);
    });
  });

  describe('update()', () => {
    test('수정된 comment entity를 리턴한다.', async () => {
      const comment = await dataSource.manager.save(new Comment({
        content: "test content...",
        writer: user,
        question: question,
      }));
      const content = "test content(수정)";

      const result = await commentsRepository.update(comment, content);

      expect(result.content).toBe("test content(수정)");
    });
  });

  describe('softDelete()', () => {
    test('해당 comment를 soft delete하고, 리턴하지 않는다.', async () => {
      const comment = await dataSource.manager.save(new Comment({
        content: "test content...",
        writer: user,
        question: question,
      }));

      const result = await commentsRepository.softDelete(comment.id);
      
      expect(result).toBeUndefined();
    });
  });

  afterEach(async () => {
    dataSource.manager.delete(Comment, {});
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
});
