import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { AppModule } from 'src/app.module';
import { QuestionsRepository } from '../repository/questions.repository';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Title } from '../domain/vo/title';
import { Content } from '../domain/vo/content';

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
    questionsRepository = app.get<QuestionsRepository>(QUESTIONS_REPOSITORY);
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

  beforeEach(async () => {
    await dataSource.manager.delete(Question, {});
  });

  //TODO: vo error 해결
  describe('findOneById()', () => {
    test('해당 ID의 질문글을 조회한다.', async () => {
      const question = await dataSource.manager.save(new Question({
        title: new Title("test"),
        content: new Content("test content..."),
        writer: user,
      }));

      const result = await questionsRepository.findOneById(question.id);

      expect(result?.id).toBe(question.id);
      expect(result?.title.getTitle()).toBe("test");
      expect(result?.content.getContent()).toBe("test content...");
    });
  });

  //TODO: vo error 해결
  describe('save()', () => {
    test('DB에 질문글 정보를 저장하고, entity를 리턴한다.', async () => {
      const question = await dataSource.manager.save(new Question({
        title: new Title("test"),
        content: new Content("test content..."),
        writer: user,
      }));

      const result = await questionsRepository.save(question);

      expect(result).toBeInstanceOf(Question);
    });
  });

  //TODO: vo error 해결
  describe('findAll()', () => {
    test('DB에 저장된 질문 목록을 전부 조회한다.', async () => {
      await dataSource.manager.save(new Question({
        title: new Title("test1"),
        content: new Content("test content..."),
        writer: user,
      }));
      await dataSource.manager.save(new Question({
        title: new Title("test2"),
        content: new Content("test content..."),
        writer: user,
      }));

      const result = await questionsRepository.findAll();

      expect(result.length).toBe(2);
    });
  });

  describe('softDelete()', () => {
    test('해당 질문글을 soft delete 한다.', async () => {
      const question = await dataSource.manager.save(new Question({
        title: new Title("test"),
        content: new Content("test content..."),
        writer: user,
      }));

      await questionsRepository.softDelete(question.id);
      
      const deletedQuestion = await questionsRepository.findOneById(question.id);
      expect(deletedQuestion).toBeNull();
    });
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
});
