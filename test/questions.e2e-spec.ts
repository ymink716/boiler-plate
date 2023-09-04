import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { QuestionsRepository } from 'src/questions/questions.repository';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';

describe('QuestionsController (e2e)', () => {
  let app: INestApplication;
  let questionsRepository: QuestionsRepository;
  let dataSource: DataSource;

  let user1, user2;
  let question1, question2;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    await app.init();

    questionsRepository = app.get('QUESTIONS_REPOSITORY');
    dataSource = app.get(DataSource);

    user1 = await dataSource.manager.save(new User({
      email: 'test@gmmail.com',
      provider: UserProvider.GOOGLE,
      providerId: 'valid providerId1',
      name: 'tester',
      picture: 'pictureURL1',
    }));

    user2 = await dataSource.manager.save(new User({
      email: 'abc@gmmail.com',
      provider: UserProvider.GOOGLE,
      providerId: 'valid providerId2',
      name: 'abc',
      picture: 'pictureURL2',
    }));
  });

  beforeEach(async () => {
    question1 = await dataSource.manager.save(new Question({
      title: '테스트 질문 제목1',
      content: '테스트 질문 내용1',
      writer: user1,
    }));

    question2 = await dataSource.manager.save(new Question({
      title: '테스트 질문 제목2',
      content: '테스트 질문 내용2',
      writer: user1,
    }));
  });

  afterEach(async () => {
    await dataSource.manager.delete(Question, {});
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });  

  describe('GET /questions', () => {
    test('status code 200으로 응답, question 리스트를 리턴한다.', async () => {
      const response = await request(app.getHttpServer()).get('/questions');

      expect(response.status).toBe(200);
      expect(response.body.questions.length).toBe(2);
      expect(response.body.questions[0].title).toBeDefined();
      expect(response.body.questions[0].content).toBeDefined();
      });
  });

  describe('GET /questions/:questionId', () => {
    test('status code 200, 해당 id의 question을 리턴한다.', async () => {
      const question = await dataSource.manager.save(new Question({
        title: 'test',
        content: 'testtesttest',
        writer: user1,
      }));

      const response = await request(app.getHttpServer()).get(`/questions/${question.id}`);

      expect(response.status).toBe(200);
      expect(response.body.question).toBeDefined();
      expect(response.body.question.title).toBe('test');
    });

    test('존재하지 않는 question이라면 404로 응답한다.', async () => {
      const response = await request(app.getHttpServer()).get('/questions/0');

      expect(response.status).toBe(404);
    });
  });
});
