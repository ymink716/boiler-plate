import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { mockAuthGuard } from '../../../test/mock-auth.guard';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { GoogleOauthGuard } from '../guards/google-oauth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { AuthService } from '../auth.service';

jest.mock('../auth.service');

describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;

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

    authService = app.get<AuthService>(AuthService);
  });

  describe('GET /auth/google/callback', () => {
    test('status code 200으로 응답한다.', async () => {
      jest.spyOn(authService, 'signIn').mockResolvedValue({
        accessToken: 'valid access token',
        refreshToken: 'valid refresh token',
      });

      const response = await request(app.getHttpServer())
        .get(`/auth/google/callback`);
      
      expect(response.status).toBe(200);
    });
  });

  describe('POST /auth/refresh', () => {
    test('status code 201로 응답한다.', async () => {
      jest.spyOn(authService, 'refresh').mockResolvedValue({
        accessToken: 'valid access token',
        refreshToken: 'valid refresh token',
      });

      const response = await request(app.getHttpServer())
        .post(`/auth/refresh`);
      
      expect(response.status).toBe(201);    
    });
  });

  describe('POST /auth/logout', () => {
    test('status code 201로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout');
      
      expect(response.status).toBe(201);    
    });
  });

  afterAll(async () => {
    await app.close();
  });  
});
