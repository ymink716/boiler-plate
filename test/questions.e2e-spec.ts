import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('QuestionsController (e2e)', () => {
  let app: INestApplication;

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
  });

  beforeEach(async () => {
    
  })

  describe('GET /questions', () => {
    test('status code 200을 리턴한다.', () => {
      return request(app.getHttpServer())
        .get('/questions')
        .expect(200);
      });
  });

  afterEach(async () => {

  });

  afterAll((done) => {
    app.close();
    done();
  });  
});
