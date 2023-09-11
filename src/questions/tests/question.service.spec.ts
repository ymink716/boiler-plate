import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Bookmark } from 'src/bookmarks/entity/bookmark.entity';
import { QuestionsService } from '../questions.service';
import { AppModule } from 'src/app.module';
import { QuestionsRepository } from '../questions.repository';

describe('QuestionService', () => {
  let app: INestApplication;
  let questionsService: QuestionsService;
  let questionsRepository: QuestionsRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    questionsService = app.get<QuestionsService>(QuestionsService);
    questionsRepository = app.get<QuestionsRepository>('QUESTIONS_REPOSITORY');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    
    await app.init();
  });

  describe('getQuestion()', () => {
    test('DB에 question의 데이터가 있을 경우 성공적으로 question 데이터로 응답한다.', async () => {
      // given
      const question = {
        id: 1,
        title: "a",
        content: "co"
      } as Question;
      
      jest.spyOn(questionsRepository, 'findOneById').mockResolvedValue(question)

      // when
      const result = await questionsService.getQuestion(question.id);

      // then
      expect(result).toEqual(question);
    });

    test('DB에 question의 데이터가 있을 경우 성공적으로 question 데이터로 응답한다.', async () => {
      // given
      jest.spyOn(questionsRepository, 'findOneById').mockResolvedValue(null)

      // when, then
      await expect(questionsService.getQuestion(1)).rejects.toThrow(NotFoundException);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
