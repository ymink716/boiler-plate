import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { CommentsService } from '../comments.service';
import { TestCommentsRepository } from './test-comments.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../entity/comment.entity';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { QuestionsService } from 'src/questions/questions.service';

describe('CommentsService', () => {
  let app: INestApplication;
  let commentsService: CommentsService;
  let commentsRepository: TestCommentsRepository;
  let questionsService: QuestionsService;
  
  let user: User;
  let question: Question;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider('COMMENTS_REPOSITORY')
    .useClass(TestCommentsRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    commentsService = app.get<CommentsService>(CommentsService);
    commentsRepository = app.get<TestCommentsRepository>('COMMENTS_REPOSITORY');
    questionsService = app.get<QuestionsService>(QuestionsService);

    setUpTestingAppModule(app);
    
    await app.init();

    user = { id: 1 } as User;
    question = {
      id: 1,
      title: "test",
      content: "test content...",
      writer: user,
    } as Question;
  });

  beforeEach(() => {
    commentsRepository.reset();
  });

  describe('writeComment()', () => {
    test('comment를 생성하고 생성된 comment를 리턴한다.', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'test comment content...',
        questionId: question.id,
      };

      jest.spyOn(questionsService, 'getQuestion').mockResolvedValue(question);

      const result = await commentsService.writeComment(createCommentDto, user);

      expect(result).toBeInstanceOf(Comment);
      expect(result.content).toBe('test comment content...');
    });

    test.each([['t'], ['0'.repeat(256)]])(
      '내용이 2글자 미만, 255글자를 초과하면 BadRequestException이 발생한다.',
      async (content) => {
        const createCommentDto: CreateCommentDto = {
          content: content,
          questionId: question.id,
        };
        
        await expect(
          commentsService.writeComment(createCommentDto, user),
        ).rejects.toThrow(BadRequestException);
      },
    );
  });

  describe('editComment()', () => {
    const updateCommentDto: UpdateCommentDto = {
      content: 'test comment content...(수정)',
    };

    test('comment를 수정하고, 수정된 comment를 리턴한다.', async () => {
      const comment = await commentsRepository.save(
        'content...', user, question,
      );

      jest.spyOn(commentsService, 'isWriter').mockReturnValue(undefined);

      const result = await commentsService.editComment(
        updateCommentDto, comment.id, user,
      );

      expect(result).toBeInstanceOf(Comment);
      expect(result.content).toBe(updateCommentDto.content);
    });

    test('DB에 해당 comment가 없다면, NotFoundException이 발생한다.', async () => {
      await expect(
        commentsService.editComment(updateCommentDto, 0, user)
      ).rejects.toThrow(NotFoundException);
    });

    test.each([['t'], ['0'.repeat(256)]])(
      '내용이 2글자 미만, 255글자를 초과하면 BadRequestException이 발생한다.',
      async (content) => {
        const comment = await commentsRepository.save(
          'content...', user, question,
        );

        const updateCommentDto: UpdateCommentDto = {
          content: content,
        };
        
        await expect(
          commentsService.editComment(updateCommentDto, comment.id, user),
        ).rejects.toThrow(BadRequestException);
      },
    );

    test('작성자가 아니라면 ForbiddenException이 발생한다.', async () => {
      const comment = await commentsRepository.save(
        'content...', user, question,
      );
      const user2 = { id: 2 } as User;

      jest.spyOn(commentsService, 'isWriter').mockImplementation(() => {
        throw new ForbiddenException();
      });

      await expect(
        commentsService.editComment(updateCommentDto, comment.id, user2),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteComment()', () => {
    test('해당 comment를 삭제하고 리턴하지 않는다.', async () => {
      const comment = await commentsRepository.save(
        'content...', user, question,
      );
      
      jest.spyOn(commentsService, 'isWriter').mockReturnValue(undefined);

      const result = await commentsService.deleteComment(
        comment.id, user,
      );

      expect(result).toBeUndefined();
    });

    test('DB에 해당 comment 데이터가 없다면, NotFoundException이 발생한다.', async () => {
      await expect(
        commentsService.deleteComment(0, user),
      ).rejects.toThrow(NotFoundException);
    });

    test('작성자가 아니라면 ForbiddenException이 발생한다.', async () => {
      const comment = await commentsRepository.save(
        'content...', user, question,
      );
      const user2 = { id: 2 } as User;

      jest.spyOn(commentsService, 'isWriter').mockImplementation(() => {
        throw new ForbiddenException();
      });

      await expect(
        commentsService.deleteComment(comment.id, user2),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getComment()', () => {
    test('DB에 해당 comment가 있다면, comment 데이터를 리턴한다.', async () => {
      const comment = await commentsRepository.save(
        'content...', user, question,
      );

      const result = await commentsService.getComment(comment.id);

      expect(result).toEqual(comment);
    });

    test('DB에 해당 comment가 없다면, NotFoundException이 발생한다.', async () => {
      await expect(
        commentsService.getComment(0)
      ).rejects.toThrow(NotFoundException);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
