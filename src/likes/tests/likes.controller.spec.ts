import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AppModule } from 'src/app.module';
import { mockAuthGuard } from '../../../test/mock-auth.guard';
import { setUpTestingAppModule } from 'src/config/app-test.config';

jest.mock('../likes.service');

describe('LikesController', () => {
  let app: INestApplication;

  const questionId = 1;
  const commentId = 1;

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
  });

  describe('POST /likes/questions/:questionId', () => {
    test('status code 201로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post(`/likes/questions/${questionId}`);
      
      expect(response.status).toBe(201);
    });
  });

  describe('DELETE /likes/questions/:questionId', () => {
    test('status code 200으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/likes/questions/${questionId}`);
      
      expect(response.status).toBe(200);
    });
  });

  describe('POST /likes/comments/:commentId', () => {
    test('status code 201로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post(`/likes/comments/${commentId}`);
      
      expect(response.status).toBe(201);
    });
  });

  describe('DELETE /likes/comments/:commentId', () => {
    test('status code 200으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/likes/comments/${commentId}`);
      
      expect(response.status).toBe(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });  
});
