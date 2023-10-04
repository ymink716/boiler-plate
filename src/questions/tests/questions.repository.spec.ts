import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { AppModule } from 'src/app.module';
import { QuestionsRepository } from '../questions.repository';
import { setUpTestingAppModule } from 'src/config/app-test.config';

describe('QuestoinsRepository', () => {
  let app: INestApplication;
  let questionsRepository: QuestionsRepository;
  let dataSource: DataSource;

  let user: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    questionsRepository = app.get<QuestionsRepository>('QUESTIONS_REPOSITORY');
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

    await dataSource.manager.save(user);
  });

  describe('findOneById()', () => {
    test('question entity를 리턴한다', async () => {
      const question = await dataSource.manager.save(new Question({
        title: "test",
        content: "test content...",
        writer: user,
      }));

      const result = await questionsRepository.findOneById(question.id);

      expect(result?.title).toBe("test");
      expect(result?.content).toBe("test content...");
    });
  });

  describe('save()', () => {
    test('save된 question entity를 리턴한다.', async () => {
      const question = await dataSource.manager.save(new Question({
        title: "test",
        content: "test content...",
        writer: user,
      }));

      const result = await questionsRepository.save(question);

      expect(result?.title).toBeDefined();
      expect(result?.content).toBeDefined();
    });
  });

  describe('findAll()', () => {
    test('저장된 question 목록을 전부 조회한다.', async () => {
      const question1 = await dataSource.manager.save(new Question({
        title: "test1",
        content: "test content...",
        writer: user,
      }));

      const question2 = await dataSource.manager.save(new Question({
        title: "test2",
        content: "test content...",
        writer: user,
      }));

      const result = await questionsRepository.findAll();

      expect(result.length).toBe(2);
      expect(result[0].title).toBe(question1.title);
      expect(result[1].title).toBe(question2.title);
    });
  });

  describe('update()', () => {
    test('수정된 question entity를 리턴한다.', async () => {
      const question = await dataSource.manager.save(new Question({
        title: "test",
        content: "test content...",
        writer: user,
      }));

      const title = "test(수정)";
      const content = "test content(수정)";

      const result = await questionsRepository.update(question, title, content);

      expect(result.title).toBe("test(수정)");
      expect(result.content).toBe("test content(수정)");
    });
  });

  describe('softDelete()', () => {
    test('해당 question을 soft delete하고, 리턴하지 않는다.', async () => {
      const question = await dataSource.manager.save(new Question({
        title: "test",
        content: "test content...",
        writer: user,
      }));

      const result = await questionsRepository.softDelete(question.id);
      
      expect(result).toBeUndefined();
    });
  });

  afterEach(async () => {
    dataSource.manager.delete(Question, {});
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
});
