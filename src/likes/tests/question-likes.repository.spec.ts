import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { QuestionLikesRepository } from '../question-likes.repository';
import { QuestionLike } from '../entity/question-like.entity';

describe('CommentsRepository', () => {
  let app: INestApplication;
  let questionLikesRepository: QuestionLikesRepository;
  let dataSource: DataSource;

  let user: User;
  let question: Question;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    questionLikesRepository = app.get<QuestionLikesRepository>('QUESTION_LIKES_REPOSITORY');
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

  describe('count()', () => {
    test('조건에 맞는 좋아요 수를 리턴한다.', async () => {
      const result = await questionLikesRepository.count(user.id, question.id);

      expect(result).toBe(0);
    });
  });

  describe('save()', () => {
    test('질문에 대한 좋아요를 DB에 저장하고 entity를 리턴한다.', async () => {
      const result = await questionLikesRepository.save(user, question);

      expect(result.user).toBeDefined();
      expect(result.question).toBeDefined();
    });
  });

  describe('findByUserIdAndQeustionId()', () => {
    test('User Id와 Question Id에 맞는 좋아요를 조회한다.', async () => {
      await dataSource.manager.save(new QuestionLike({ user, question }));

      const result = await questionLikesRepository.findByUserIdAndQeustionId(user.id, question.id);

      expect(result.length).toBe(1);
      expect(result[0].user).toBeDefined();
      expect(result[0].question).toBeDefined();
    });
  });

  describe('delete()', () => {
    test('해당 좋아요를 삭제하고, 리턴하지 않는다.', async () => {
      const questionLike = await dataSource.manager.save(new QuestionLike({ user, question }));

      const result = await questionLikesRepository.delete(questionLike.id);
      
      expect(result).toBeUndefined();
    });
  });

  afterEach(async () => {
    dataSource.manager.delete(QuestionLike, {});
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
});
