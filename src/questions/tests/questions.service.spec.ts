import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { QuestionsService } from '../questions.service';
import { AppModule } from 'src/app.module';
import { TestQuestionsRepository } from './test-questions.repository';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';

describe('QuestionsService', () => {
  let app: INestApplication;
  let questionsService: QuestionsService;
  let questionsRepository: TestQuestionsRepository;

  let user: User;
  let question: Question;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider('QUESTIONS_REPOSITORY')
    .useClass(TestQuestionsRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    questionsService = app.get<QuestionsService>(QuestionsService);
    questionsRepository = app.get<TestQuestionsRepository>('QUESTIONS_REPOSITORY');

    setUpTestingAppModule(app);
    
    await app.init();

    user = { id: 1 } as User;
    question = new Question({
      title: "test",
      content: "test content...",
      writer: user,
    });
  });

  beforeEach(() => {
    questionsRepository.reset();
  });

  describe('postQuestion()', () => {
    test('question을 생성하고 생성된 question을 리턴한다.', async () => {
      const createQuestionDto: CreateQuestionDto = {
        title: 'test quesetion title',
        content: 'test question content...',
      };

      const result = await questionsService.postQuestion(createQuestionDto, user);

      expect(result).toBeInstanceOf(Question);
      expect(result.title).toBe('test quesetion title');
      expect(result.content).toBe('test question content...');
    });

    test.each([['t'], ['0'.repeat(51)]])(
      '제목이 2글자 미만, 50글자를 초과하면 BadRequestException이 발생한다.',
      async (title) => {
        const createQuestionDto: CreateQuestionDto = {
          title: title,
          content: 'test question content...',
        };
        
        await expect(
          questionsService.postQuestion(createQuestionDto, user),
        ).rejects.toThrow(BadRequestException);
      },
    );

    test.each([['t'], ['0'.repeat(501)]])(
      '내용이 2글자 미만, 500글자를 초과하면 BadRequestException이 발생한다.',
      async (content) => {
        const createQuestionDto: CreateQuestionDto = {
          title: 'test',
          content: content,
        };
        
        await expect(
          questionsService.postQuestion(createQuestionDto, user),
        ).rejects.toThrow(BadRequestException);
      },
    );
  });

  describe('getQuestions()', () => {
    test('question 목록을 조회한다.', async () => {
      const question1 = new Question({
        title: "test1",
        content: "test content...",
        writer: user,
      });
  
      const question2 = new Question({
        title: "test2",
        content: "test content...",
        writer: user,
      });

      questionsRepository.save(question1);
      questionsRepository.save(question2);

      const result = await questionsService.getQuestions();

      expect(result.length).toBe(2);
      expect(result).toEqual([question1, question2]);
    });
  });

  describe('getQuestion()', () => {
    test('DB에 question의 데이터가 있다면, question 데이터를 리턴한다.', async () => {
      const savedQeustion = await questionsRepository.save(question);

      const result = await questionsService.getQuestion(savedQeustion.id);

      expect(result).toEqual(savedQeustion);
    });

    test('DB에 question의 데이터가 없다면, NotFoundException이 발생한다.', async () => {
      await expect(
        questionsService.getQuestion(0)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateQuestion()', () => {
    const updateQuestionDto: UpdateQuestionDto = {
      title: 'test quesetion title(수정)',
      content: 'test question content...(수정)',
    };

    test('question을 수정하고, 수정된 question을 리턴한다.', async () => {
      const savedQeustion = await questionsRepository.save(question);

      jest.spyOn(questionsService, 'isWriter').mockReturnValue(undefined);

      const result = await questionsService.updateQuestion(
        savedQeustion.id, user, updateQuestionDto
      );

      expect(result).toBeInstanceOf(Question);
      expect(result.title).toBe('test quesetion title(수정)');
      expect(result.content).toBe('test question content...(수정)');
    });

    test('DB에 question의 데이터가 없다면, NotFoundException이 발생한다.', async () => {
      await expect(
        questionsService.updateQuestion(0, user, new UpdateQuestionDto())
      ).rejects.toThrow(NotFoundException);
    });

    test.each([['t'], ['0'.repeat(51)]])(
      '제목이 2글자 미만, 50글자를 초과하면 BadRequestException이 발생한다.',
      async (title) => {
        const savedQeustion = await questionsRepository.save(question);

        const updateQuestionDto: UpdateQuestionDto = {
          title: title,
          content: 'test question content...',
        };
        
        await expect(
          questionsService.updateQuestion(savedQeustion.id, user, updateQuestionDto),
        ).rejects.toThrow(BadRequestException);
      },
    );

    test.each([['t'], ['0'.repeat(501)]])(
      '내용이 2글자 미만, 500글자를 초과하면 BadRequestException이 발생한다.',
      async (content) => {
        const savedQeustion = await questionsRepository.save(question);

        const updateQuestionDto: UpdateQuestionDto = {
          title: 'test',
          content: content,
        };
        
        await expect(
          questionsService.updateQuestion(savedQeustion.id, user, updateQuestionDto),
        ).rejects.toThrow(BadRequestException);
      },
    );

    test('작성자가 아니라면 ForbiddenException이 발생한다.', async () => {
      const savedQeustion = await questionsRepository.save(question);
      const user2 = { id: 2 } as User;

      jest.spyOn(questionsService, 'isWriter').mockImplementation(() => {
        throw new ForbiddenException();
      });

      await expect(
        questionsService.updateQuestion(savedQeustion.id, user2, updateQuestionDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteQuestion()', () => {
    test('해당 question을 삭제하고 리턴하지 않는다.', async () => {
      const savedQuestion = await questionsRepository.save(question);
      jest.spyOn(questionsService, 'isWriter').mockReturnValue(undefined);

      const result = await questionsService.deleteQuestion(
        savedQuestion.id, user
      );

      expect(result).toBeUndefined();
    });

    test('DB에 question의 데이터가 없다면, NotFoundException이 발생한다.', async () => {
      await expect(
        questionsService.deleteQuestion(0, user),
      ).rejects.toThrow(NotFoundException);
    });

    test('작성자가 아니라면 ForbiddenException이 발생한다.', async () => {
      const savedQuestion = await questionsRepository.save(question);
      const user2 = { id: 2 } as User;

      jest.spyOn(questionsService, 'isWriter').mockImplementation(() => {
        throw new ForbiddenException();
      });

      await expect(
        questionsService.deleteQuestion(savedQuestion.id, user2),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
