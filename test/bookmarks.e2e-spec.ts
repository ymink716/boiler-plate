import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Bookmark } from 'src/bookmarks/entity/bookmark.entity';

describe('LikesController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  let user: User;
  let question: Question;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        request['user'] = { id: 1 };
        return true;
      },
    })
    .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    
    await app.init();

    dataSource = app.get(DataSource);

    user = await dataSource.manager.save(new User({
      email: 'test@gmmail.com',
      provider: UserProvider.GOOGLE,
      providerId: 'valid providerId1',
      name: 'tester',
      picture: 'pictureURL1',
    }));

    question = await dataSource.manager.save(new Question({
      title: 'test question',
      content: 'test question contents...',
      writer: user,
    }));
  });

  afterEach(async () => {
    await dataSource.manager.delete(Bookmark, {});
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });  

  describe('POST /bookmarks/questions/:questionId', () => {
    test('status code 201로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post(`/bookmarks/questions/${question.id}`);
      
      expect(response.status).toBe(201);
    });

    test('이미 북마크되어있다면 400으로 응답한다.', async () => {
      await dataSource.manager.save(new Bookmark({ user, question }));
      
      const response = await request(app.getHttpServer())
        .post(`/bookmarks/questions/${question.id}`);
    
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /bookmarks/questions/:questionId', () => {
    test('status code 200으로 응답한다.', async () => {
      await dataSource.manager.save(new Bookmark({ user, question }));

      const response = await request(app.getHttpServer())
        .delete(`/bookmarks/questions/${question.id}`);

      expect(response.status).toBe(200);
    });
  });
});
