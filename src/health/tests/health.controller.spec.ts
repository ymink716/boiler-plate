import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';


describe('CommentsController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    setUpTestingAppModule(app);

    await app.init();
  });

  describe('GET /health', () => {
    test('status code 200으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .get(`/health`);
      
      expect(response.status).toBe(200);
    });
  });


  afterAll(async () => {
    await app.close();
  });  
});
