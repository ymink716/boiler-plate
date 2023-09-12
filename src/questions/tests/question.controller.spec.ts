import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AppModule } from 'src/app.module';
import { QuestionsService } from '../questions.service';
jest.mock('../questions.service');

describe('QuestionsController', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let questionsService: QuestionsService;

  let user1, user2;
  let question1, question2;

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
    questionsService = app.get(QuestionsService);
    console.log(questionsService);

    user1 = await dataSource.manager.save(new User({
      email: 'test@gmmail.com',
      provider: UserProvider.GOOGLE,
      providerId: 'valid providerId1',
      name: 'tester',
      picture: 'pictureURL1',
    }));

    user2 = await dataSource.manager.save(new User({
      email: 'abc@gmmail.com',
      provider: UserProvider.GOOGLE,
      providerId: 'valid providerId2',
      name: 'abc',
      picture: 'pictureURL2',
    }));
  });

  beforeEach(async () => {
    question1 = await dataSource.manager.save(new Question({
      title: '테스트 질문 제목1',
      content: '테스트 질문 내용1',
      writer: user1,
    }));

    question2 = await dataSource.manager.save(new Question({
      title: '테스트 질문 제목2',
      content: '테스트 질문 내용2',
      writer: user2,
    }));
  });

  describe('GET /questions', () => {
    test('status code 200으로 응답하고, question 리스트를 리턴한다.', async () => {
      const response = await request(app.getHttpServer()).get('/questions');
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
