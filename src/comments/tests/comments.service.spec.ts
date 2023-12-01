import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { CommentsService } from '../comments.service';
import { TestCommentsRepository } from '../repository/test-comments.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../entity/comment.entity';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { QuestionsService } from 'src/questions/questions.service';
import { COMMENTS_REPOSITORY } from '../../common/constants/tokens.constant';
import { Title } from 'src/questions/domain/vo/title';
import { Content as QuestionContent } from 'src/questions/domain/vo/content';
import Content from 'src/comments/domain/vo/content';

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
    .overrideProvider(COMMENTS_REPOSITORY)
    .useClass(TestCommentsRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    commentsService = app.get<CommentsService>(CommentsService);
    commentsRepository = app.get<TestCommentsRepository>(COMMENTS_REPOSITORY);
    questionsService = app.get<QuestionsService>(QuestionsService);

    setUpTestingAppModule(app);
    
    await app.init();

    user = { id: 1 } as User;
    question = {
      id: 1,
      title: new Title("test"),
      content: new QuestionContent("test content..."),
      writer: user,
    } as Question;
  });

  beforeEach(() => {
    commentsRepository.reset();
  });

  describe('writeComment()', () => {
    test('답변 정보를 생성하여 DB에 저장하고, 답변 entity를 리턴한다.', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'test comment content...',
        questionId: question.id,
      };

      jest.spyOn(questionsService, 'getQuestion').mockResolvedValue(question);
      
      const result = await commentsService.writeComment(createCommentDto, user);

      expect(await commentsRepository.findOneById(result.id)).toBeInstanceOf(Comment);
      expect(result.content.getContent()).toBe(createCommentDto.content);
    });
  });

  describe('editComment()', () => {
    const updateCommentDto: UpdateCommentDto = {
      content: 'test comment content...(수정)',
    };

    test('답변을 수정하여 DB에 저장하고, 답변 entity를 리턴한다.', async () => {
      let comment = new Comment({ 
        content: new Content('content...'), 
        writer: user, 
        question, 
      });
      comment = await commentsRepository.save(comment);
      jest.spyOn(comment, 'checkIsAuthor').mockReturnValueOnce(undefined);

      const result = await commentsService.editComment(
        updateCommentDto, comment.id, user,
      );
      
      expect(result).toBeInstanceOf(Comment);
      expect(await commentsRepository.findOneById(result.id)).toBe(result);
    });

    test('DB에 해당 comment가 없다면, NotFoundException이 발생한다.', async () => {
      const notExistedCommentId = 0;

      await expect(
        commentsService.editComment(updateCommentDto, notExistedCommentId, user)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteComment()', () => {
    test('해당 답변을 DB에서 삭제하는 메서드를 호출한다.', async () => {
      let comment = new Comment({ 
        content: new Content('content...'), 
        writer: user, 
        question, 
      });
      comment = await commentsRepository.save(comment);

      await commentsService.deleteComment(comment.id, user);

      expect(await commentsRepository.findOneById(comment.id)).toBeNull();
    });

    test('DB에 해당 comment 데이터가 없다면, NotFoundException이 발생한다.', async () => {
      const notExistedCommentId = 0;

      await expect(
        commentsService.deleteComment(notExistedCommentId, user),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getComment()', () => {
    test('id에 해당하는 답변이 있다면, 답변 entity를 리턴한다.', async () => {
      let comment = new Comment({ 
        content: new Content('content...'), 
        writer: user, 
        question, 
      });
      comment = await commentsRepository.save(comment);

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
