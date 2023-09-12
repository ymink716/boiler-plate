import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { mockAuthGuard } from './mock-auth.guard';
import { setUpTestingAppModule } from 'src/config/app-test.config';

describe('QuestionsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  let user;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    app = moduleFixture.createNestApplication();
    setUpTestingAppModule(app);
    await app.init();

    dataSource = app.get<DataSource>(DataSource);

    user = await dataSource.manager.save(new User({
      email: 'test@gmmail.com',
      provider: UserProvider.GOOGLE,
      providerId: 'valid providerId1',
      name: 'tester',
      picture: 'pictureURL1',
    }));
  });

  describe('GET /questions', () => {
    test('status code 200으로 응답하고, question 리스트를 리턴한다.', async () => {
      await dataSource.manager.save(new Question({
        title: '테스트 질문 제목1',
        content: '테스트 질문 내용1',
        writer: user,
      }));
  
      await dataSource.manager.save(new Question({
        title: '테스트 질문 제목2',
        content: '테스트 질문 내용2',
        writer: user,
      }));
      
      const response = await request(app.getHttpServer()).get('/questions');

      expect(response.status).toBe(200);
      expect(response.body.questions.length).toBe(2);
      expect(response.body.questions[0].title).toBeDefined();
      expect(response.body.questions[0].content).toBeDefined();
      });
  });

  describe('GET /questions/:questionId', () => {
    test('status code 200로 응답하고, 해당 id의 question을 리턴한다.', async () => {
      const question = await dataSource.manager.save(new Question({
        title: 'test',
        content: 'testtesttest',
        writer: user,
      }));

      const response = await request(app.getHttpServer()).get(`/questions/${question.id}`);

      expect(response.status).toBe(200);
      expect(response.body.question).toBeDefined();
      expect(response.body.question.title).toBe('test');
    });
  });

  describe('POST /questions', () => {
    test('status code 201로 응답하고, 생성된 question을 리턴한다.', async () => {
      const requestBody = {
        title: 'test question title',
        content: 'test question content...'
      }

      const response = await request(app.getHttpServer())
        .post('/questions')
        .send(requestBody);
      
      expect(response.status).toBe(201);
      expect(response.body.newQuestion).toBeDefined();
      expect(response.body.newQuestion.title).toBe('test question title');
    });
  });

  describe('PUT /questions/:questionId', () => {
    test('status code 200으로 응답하고, 수정된 question을 리턴한다.', async () => {
      const question = await dataSource.manager.save(new Question({
        title: 'test question title',
        content: 'test question content...',
        writer: user,
      }));

      const requestBody = {
        title: 'test question title(수정)',
        content: 'test question content...(수정)',
      }

      const response = await request(app.getHttpServer())
        .put(`/questions/${question.id}`)
        .send(requestBody);
      
      expect(response.status).toBe(200);
      expect(response.body.updatedQuestion).toBeDefined();
      expect(response.body.updatedQuestion.title).toBe('test question title(수정)'); 
      expect(response.body.updatedQuestion.content).toBe('test question content...(수정)');   
    });
  });

  describe('DELETE /questions/:questionId', () => {
    test('status code 200으로 응답한다.', async () => {
      const question = await dataSource.manager.save(new Question({
        title: 'test question title',
        content: 'test question content...',
        writer: user,
      }));

      const response = await request(app.getHttpServer()).delete(`/questions/${question.id}`);

      expect(response.status).toBe(200);
    });
  });

  afterEach(async () => {
    await dataSource.manager.delete(Question, {});
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  }); 
});
