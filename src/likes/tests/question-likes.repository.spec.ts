import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/infrastructure/entity/question.entity';
import { User } from 'src/users/infrastructure/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { QuestionLikesRepository } from '../domain/repository/question-likes.repository';
import { QuestionLike } from '../infrastructure/entity/question-like.entity';
import { QUESTION_LIKES_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Title } from 'src/questions/domain/title';
import { Content } from 'src/questions/domain/content';

describe('QuestionLikesRepository', () => {
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
    questionLikesRepository = app.get<QuestionLikesRepository>(QUESTION_LIKES_REPOSITORY);
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
      title: new Title("test"),
      content: new Content("test content..."),
      writer: user,
    }); 

    await dataSource.manager.save(user);
    await dataSource.manager.save(question);
  });

  beforeEach(async () => {
    await dataSource.manager.delete(QuestionLike, {});
  });

  describe('count()', () => {
    test('유저ID, 질문ID에 해당하는 좋아요 수를 리턴한다.', async () => {
      const result = await questionLikesRepository.count(user.id, question.id);

      expect(result).toBe(0);
    });
  });

  describe('save()', () => {
    test('질문에 대한 좋아요를 DB에 저장하고, 해당 정보를 리턴한다.', async () => {
      const questionLike = new QuestionLike({ user, question });
      const result = await questionLikesRepository.save(questionLike);

      expect(result).toBeInstanceOf(QuestionLike);
      expect(result.user).toBeDefined();
      expect(result.question).toBeDefined();
    });
  });

  //TODO: questions/domain/vo/title.ts title.length undefined error 해결
  describe('findByUserIdAndQeustionId()', () => {
    test('유저ID와 질문ID에 맞는 좋아요를 조회한다.', async () => {
      await dataSource.manager.save(new QuestionLike({ user, question }));

      const result = await questionLikesRepository.findByUserIdAndQeustionId(user.id, question.id);

      expect(result.length).toBe(1);
      expect(result[0].user.id).toBe(user.id);
      expect(result[0].question.id).toBe(question.id);
    });
  });

  describe('remove()', () => {
    test('좋아요 정보를 DB에서 삭제한다.', async () => {
      const questionLike = await dataSource.manager.save(new QuestionLike({ user, question }));

      await questionLikesRepository.remove([questionLike]);
      const questionLikes = await questionLikesRepository.findByUserIdAndQeustionId(user.id, question.id);

      expect(questionLikes.length).toBe(0);
    });
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
});
