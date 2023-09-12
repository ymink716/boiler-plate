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

describe('QuestoinRepository', () => {
  let app: INestApplication;
  let questionsRepository: QuestionsRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    questionsRepository = app.get<QuestionsRepository>('QUESTIONS_REPOSITORY');
    dataSource = app.get<DataSource>(DataSource);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    
    await app.init();
  });

  describe('QuestionsRepository', () => {
    test('id에 해당하는 question이 있다면 question entity를 리턴한다', async () => {
      // given
      const user = new User({ 
        email: 'test@email.com',
        provider: UserProvider.GOOGLE,
        providerId: "asdfdsf",
        name: "asdf",
        picture: "asdfasdf",
      });

      await dataSource.manager.save(user);

      const question = await dataSource.manager.save(new Question({
        title: "test",
        content: "test test",
        writer: user,
      }));

      // when
      const result = await questionsRepository.findOneById(question.id);

      // then
      expect(result?.title).toBeDefined();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
