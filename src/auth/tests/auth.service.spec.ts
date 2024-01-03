import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { UsersService } from '../../users/application/users.service';
import { AuthService } from '../application/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { mockJwtService } from './mock-jwt.service';
import { mockConfigService } from './mock-config.service';

describe('AuthService', () => {
  let app: INestApplication;
  let authService: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService }, 
      ],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    authService = app.get<AuthService>(AuthService);
    jwtService = app.get<JwtService>(JwtService);
    configService = app.get<ConfigService>(ConfigService);
    usersService = app.get<UsersService>(UsersService);

    setUpTestingAppModule(app);
    
    await app.init();
  });

  describe('signIn()', () => {
    test('토큰 발급을 위한 메서드를 호출한다.', async () => {
      const userId = 1;
      jest.spyOn(authService, 'issueTokens').mockResolvedValueOnce({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      await authService.signIn(userId);

      expect(authService.issueTokens).toBeCalled();
    });
  });

  describe('refresh()', () => {
    test('토큰 발급을 위한 메서드를 호출한다.', async () => {
      const userId = 1;
      jest.spyOn(authService, 'issueTokens').mockResolvedValueOnce({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      await authService.refresh(userId);

      expect(authService.issueTokens).toBeCalled();
    });
  });

  describe('issueTokens()', () => {
    test('리프레시 토큰을 사용자 정보에 업데이트하는 로직을 실행한다.', async () => {
      jest.spyOn(usersService, 'updateRefreshToken').mockResolvedValueOnce(undefined);
      const userId = 1;
      
      await authService.issueTokens(userId);

      expect(usersService.updateRefreshToken).toBeCalled();
    });

    test('리프레시 토큰을 사용자 정보에 업데이트하는 로직을 실행한다.', async () => {
      jest.spyOn(usersService, 'updateRefreshToken').mockResolvedValueOnce(undefined);
      const userId = 1;
      
      const result = await authService.issueTokens(userId);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe('logout()', () => {
    test('DB에 저장된 리프레시 토큰을 삭제하기 위한 로직을 실행한다.', async () => {
      jest.spyOn(usersService, 'removeRefreshToken').mockResolvedValueOnce(undefined);

      const userId = 1;
      await authService.logout(userId);

      expect(usersService.removeRefreshToken).toBeCalled();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
