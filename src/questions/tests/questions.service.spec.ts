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
import { QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';

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
    .overrideProvider(QUESTIONS_REPOSITORY)
    .useClass(TestQuestionsRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    questionsService = app.get<QuestionsService>(QuestionsService);
    questionsRepository = app.get<TestQuestionsRepository>(QUESTIONS_REPOSITORY);

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
    test('작성한 질문 정보를 DB에 저장하고, entity를 반환한다.', async () => {
      const createQuestionDto: CreateQuestionDto = {
        title: 'test quesetion title',
        content: 'test question content...',
      };

      const result = await questionsService.postQuestion(createQuestionDto, user);

      expect(result).toBeInstanceOf(Question);
      expect(result.title).toBe(createQuestionDto.title);
      expect(result.content).toBe(createQuestionDto.content);
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

    test.each([['tt'], ['0'.repeat(50)]])(
      '제목이 2글자 이상, 50글자 이하이면 유효성 검사를 통과한다.',
      async (title) => {
        const createQuestionDto: CreateQuestionDto = {
          title: title,
          content: 'test question content...',
        };
        
        jest.spyOn(questionsService, 'isValidQeustionDto');
        const result = await questionsService.postQuestion(createQuestionDto, user);

        expect(questionsService.isValidQeustionDto).toBeCalled();
        expect(result).toBeInstanceOf(Question);
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

    test.each([['tt'], ['0'.repeat(500)]])(
      '내용이 2글자 이상, 500글자 이하이면 유효성 검사를 통과한다.',
      async (content) => {
        const createQuestionDto: CreateQuestionDto = {
          title: 'test',
          content: content,
        };
        
        jest.spyOn(questionsService, 'isValidQeustionDto');
        const result = await questionsService.postQuestion(createQuestionDto, user);
  
        expect(questionsService.isValidQeustionDto).toBeCalled();
        expect(result).toBeInstanceOf(Question);
      },
    );
  });

  describe('getQuestions()', () => {
    test('질문글 목록 전체를 조회한다.', async () => {
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
    test('id에 해당하는 질문글 하나를 가져온다.', async () => {
      const savedQeustion = await questionsRepository.save(question);

      const result = await questionsService.getQuestion(savedQeustion.id);

      expect(result).toEqual(savedQeustion);
    });

    test('DB에 해당 질문글이 없으면, NotFoundException이 발생한다.', async () => {
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

    test('수정된 질문을 DB에 저장하고, 수정된 질문 entity를 리턴한다.', async () => {
      const savedQeustion = await questionsRepository.save(question);

      jest.spyOn(questionsService, 'isWriter').mockReturnValue(undefined);

      const result = await questionsService.updateQuestion(
        savedQeustion.id, user, updateQuestionDto
      );

      expect(result).toBeInstanceOf(Question);
      expect(result.title).toBe(updateQuestionDto.title);
      expect(result.content).toBe(updateQuestionDto.content);
      expect(await questionsRepository.findOneById(savedQeustion.id)).toBe(result);
    });

    test('DB에 해당 질문이 없다면, NotFoundException이 발생한다.', async () => {
      const notExistedQuestionId = 0;

      await expect(
        questionsService.updateQuestion(notExistedQuestionId, user, updateQuestionDto)
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

    test.each([['tt'], ['0'.repeat(50)]])(
      '제목이 2글자 이상, 50글자 이하이면 유효성 검사를 통과한다.',
      async (title) => {
        const savedQeustion = await questionsRepository.save(question);

        const updateQuestionDto: UpdateQuestionDto = {
          title: title,
          content: 'test question content...',
        };
        
        const result = await questionsService.updateQuestion(savedQeustion.id, user, updateQuestionDto);

        expect(result.title).toBe(updateQuestionDto.title);

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

    test.each([['tt'], ['0'.repeat(500)]])(
      '내용이 2글자 이상, 500글자 이하이면 유효성 검사를 통과한다.',
      async (content) => {
        const savedQeustion = await questionsRepository.save(question);

        const updateQuestionDto: UpdateQuestionDto = {
          title: 'test',
          content: content,
        };
        
        const result = await questionsService.updateQuestion(
          savedQeustion.id, user, updateQuestionDto
        );

        expect(result.content).toBe(updateQuestionDto.content);
      },
    );
  });

  describe('deleteQuestion()', () => {
    test('id에 해당하는 질문글을 DB에서 삭제한다.', async () => {
      const savedQuestion = await questionsRepository.save(question);
      jest.spyOn(questionsService, 'isWriter').mockReturnValue(undefined);

      await questionsService.deleteQuestion(
        savedQuestion.id, user
      );

      expect(await questionsRepository.findOneById(savedQuestion.id)).toBeNull();
    });

    test('해당 질문글이 없다면, NotFoundException이 발생한다.', async () => {
      const notExistedQuestionId = 0;

      await expect(
        questionsService.deleteQuestion(notExistedQuestionId, user),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('', () => {
    test('질문 작성자가 아니라면 ForbiddenException이 발생한다.', async () => {
      const writerId = 1;
      const userId = 2;

      try {
        questionsService.isWriter(writerId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  })

  afterAll(async () => {
    await app.close();
  });
});
