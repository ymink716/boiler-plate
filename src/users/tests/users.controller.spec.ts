import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AppModule } from 'src/app.module';
import { mockAuthGuard } from '../../../test/mock-auth.guard';
import { setUpTestingAppModule } from 'src/config/app-test.config';

jest.mock('../users.service');

describe('UsersController', () => {
  let app: INestApplication;

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

  describe('GET /users/profile', () => {
    test('status code 200으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/profile`);
      
      expect(response.status).toBe(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });  
});
