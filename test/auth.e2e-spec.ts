import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from "typeorm"
import { User } from 'src/users/infrastructure/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { GoogleOauthGuard } from 'src/auth/guards/google-oauth.guard';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh.guard';
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
    .overrideGuard(GoogleOauthGuard)
    .useValue(mockAuthGuard)
    .overrideGuard(JwtRefreshGuard)
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

  describe('GET /auth/google/callback', () => {
    test('status code 200으로 응답하고, 생성된 token을 리턴한다.', async () => {
      const response = await request(app.getHttpServer()).get(`/auth/google/callback`);

      expect(response.status).toBe(200);
      expect(response.body.access_token).toBeDefined();
      expect(response.body.refresh_token).toBeDefined();
    });
  });

  describe('POST /auth/refresh', () => {
    test('status code 201로 응답하고, 갱신된 token을 리턴한다.', async () => {
      const refreshToken = "validJwtRefreshToken";

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken });
    
      expect(response.status).toBe(201);
      expect(response.body.access_token).toBeDefined();
      expect(response.body.refresh_token).toBeDefined();
    });
  });

  describe('POST /auth/logout', () => {
    test('status code 201로 응답한다.', async () => {
      const refreshToken = "validJwtRefreshToken";

      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .send({ refreshToken });
      
      expect(response.status).toBe(201);
    });
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  }); 
});
