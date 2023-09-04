import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

describe('QuestionsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  let user1, user2;
  let question1, question2;

  jest.setTimeout(30000);

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

  afterEach(async () => {
    await dataSource.manager.delete(Question, {});
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });  

  describe('GET /questions', () => {
    test('status code 200으로 응답하고, question 리스트를 리턴한다.', async () => {
      const response = await request(app.getHttpServer()).get('/questions');

      expect(response.status).toBe(200);
      expect(response.body.questions.length).toBe(2);
      expect(response.body.questions[0].title).toBeDefined();
      expect(response.body.questions[0].content).toBeDefined();
      });
  });

  describe('GET /questions/:questionId', () => {
    test('status code 200로 응답하고, 해당 id의 question을 리턴한다.', async () => {
      const question = await dataSource.manager.save(new Question({
        title: 'test',
        content: 'testtesttest',
        writer: user1,
      }));

      const response = await request(app.getHttpServer()).get(`/questions/${question.id}`);

      expect(response.status).toBe(200);
      expect(response.body.question).toBeDefined();
      expect(response.body.question.title).toBe('test');
    });

    test('존재하지 않는 question이라면 404로 응답한다.', async () => {
      const response = await request(app.getHttpServer()).get('/questions/0');
      
      expect(response.status).toBe(404);
    });
  });

  describe('POST /questions', () => {
    test('status code 201로 응답하고, 생성된 question을 리턴한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/questions')
        .send({
          title: 'test question title',
          content: 'test question content...'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.newQuestion).toBeDefined();
      expect(response.body.newQuestion.title).toBe('test question title');
    });

    test('request body의 값이 올바르지 않다면 status code 400으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/questions')
        .send({ title: 't' });
      
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /questions/:questionId', () => {
    test('status code 200으로 응답하고, 수정된 question을 리턴한다.', async () => {
      const response = await request(app.getHttpServer())
        .put(`/questions/${question1.id}`)
        .send({
          title: 'test question title(수정)',
          content: 'test question content...(수정)'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.updatedQuestion).toBeDefined();
      expect(response.body.updatedQuestion.title).toBe('test question title(수정)');  
    });

    test('request body의 값이 올바르지 않다면 status code 400으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .put(`/questions/${question1.id}`)
        .send({ title: 't', content: 1234 });
      
      expect(response.status).toBe(400);
    });

    test('존재하지 않는 question이라면 404로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .put(`/questions/0`)
        .send({
          title: 'test question title(수정)',
          content: 'test question content...(수정)'
        });

      expect(response.status).toBe(404);
    });

    test('작성자가 아니라면 403으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
      .put(`/questions/${question2.id}`)
      .send({
        title: 'test question title(수정)',
        content: 'test question content...(수정)'
      });
    
      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /questions/:questionId', () => {
    test('status code 200으로 응답한다.', async () => {
      const response = await request(app.getHttpServer()).delete(`/questions/${question1.id}`);

      expect(response.status).toBe(200);
    });

    test('존재하지 않는 question이라면 404로 응답한다.', async () => {
      const response = await request(app.getHttpServer()).delete(`/questions/0`);

      expect(response.status).toBe(404);
    });

    test('작성자가 아니라면 403으로 응답한다.', async () => {
      const response = await request(app.getHttpServer()).delete(`/questions/${question2.id}`);

      expect(response.status).toBe(403);
    });
  });
});
