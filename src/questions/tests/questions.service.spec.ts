import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Question } from 'src/questions/infrastructure/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { QuestionsService } from '../application/questions.service';
import { AppModule } from 'src/app.module';
import { TestQuestionsRepository } from '../infrastructure/test-questions.repository';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Title } from '../domain/vo/title';
import { Content } from '../domain/vo/content';

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
      title: new Title("test"),
      content: new Content("test content..."),
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
      expect(result.title.getTitle()).toBe(createQuestionDto.title);
      expect(result.content.getContent()).toBe(createQuestionDto.content);
    });
  });

  describe('getQuestions()', () => {
    test('질문글 목록 전체를 조회한다.', async () => {
      const question1 = new Question({
        title: new Title("test1"),
        content: new Content("test content..."),
        writer: user,
      });
  
      const question2 = new Question({
        title: new Title("test2"),
        content: new Content("test content..."),
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

      const result = await questionsService.updateQuestion(
        savedQeustion.id, user, updateQuestionDto
      );

      expect(result).toBeInstanceOf(Question);
      expect(result.title.getTitle()).toBe(updateQuestionDto.title);
      expect(result.content.getContent()).toBe(updateQuestionDto.content);
    });

    test('DB에 해당 질문이 없다면, NotFoundException이 발생한다.', async () => {
      const notExistedQuestionId = 0;

      await expect(
        questionsService.updateQuestion(notExistedQuestionId, user, updateQuestionDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteQuestion()', () => {
    test('id에 해당하는 질문글을 DB에서 삭제한다.', async () => {
      const savedQuestion = await questionsRepository.save(question);

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

  afterAll(async () => {
    await app.close();
  });
});
