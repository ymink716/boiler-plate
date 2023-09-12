import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AppModule } from 'src/app.module';
import { QuestionsService } from '../questions.service';
import { mockAuthGuard } from '../../../test/mock-auth.guard';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { TypeOrmModule } from '@nestjs/typeorm';

jest.mock('../questions.service');

describe('QuestionsController', () => {
  let app: INestApplication;
  let questionsService: QuestionsService;

  const questionId = 1;

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

    questionsService = app.get<QuestionsService>(QuestionsService);
  });

  describe('POST /questions', () => {
    test('status code 201로 응답한다.', async () => {
      const requestBody = {
        title: "test question title",
        content: "test qustion content...",
      }

      const response = await request(app.getHttpServer())
        .post('/questions')
        .send(requestBody);
      
      expect(response.status).toBe(201);
    });

    test('request body에 유효하지 않은 값이 들어가면 400으로 응답한다.', async () => {
      const invalidRequestBody = {
        title: "t",
        content: 1234,
      }
      
      const response = await request(app.getHttpServer())
        .post('/questions')
        .send(invalidRequestBody);
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /questions', () => {
    test('status code 200으로 응답한다.', async () => {
      const response = await request(app.getHttpServer()).get('/questions');
      
      expect(response.status).toBe(200);
    });
  });

  describe('GET /questions/:questionId', () => {
    test('status code 200으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .get(`/questions/${questionId}`);
      
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /questions/:questionId', () => {
    test('status code 200으로 응답한다.', async () => {
      const requestBody = {
        title: "test question title(updated)",
        content: "test qustion content...(updated)",
      }

      const response = await request(app.getHttpServer())
        .put(`/questions/${questionId}`)
        .send(requestBody);
      
      expect(response.status).toBe(200);
    });

    test('request body에 유효하지 않은 값이 들어가면 400으로 응답한다.', async () => {
      const requestBody = { title: "" }

      const response = await request(app.getHttpServer())
        .put(`/questions/${questionId}`)
        .send(requestBody);
      
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /questions/:questionId', () => {
    test('status code 200으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/questions/${questionId}`);
      
      expect(response.status).toBe(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });  
});
