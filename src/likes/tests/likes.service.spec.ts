import { QuestionLike } from 'src/likes/entity/question-like.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { QuestionLikesRepository } from '../question-likes.repository';
import { QuestionsService } from 'src/questions/questions.service';
import { CommentLikesRepository } from '../comment-likes.repository';
import { CommentsService } from 'src/comments/comments.service';
import { Comment } from 'src/comments/entity/comment.entity';
import { LikesService } from '../likes.service';
import { CommentLike } from '../entity/comment-like.entity';

describe('LikesService', () => {
  let app: INestApplication;

  let likesService: LikesService;
  let questionLikesRepository: QuestionLikesRepository;
  let questionsService: QuestionsService;
  let commentLikesRepository: CommentLikesRepository;
  let commentsService: CommentsService;

  let user: User;
  let question: Question;
  let comment: Comment

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();

    likesService = app.get<LikesService>(LikesService);
    questionLikesRepository = app.get<QuestionLikesRepository>('QUESTION_LIKES_REPOSITORY');
    questionsService = app.get<QuestionsService>(QuestionsService);
    commentLikesRepository = app.get<CommentLikesRepository>('COMMENT_LIKES_REPOSITORY');
    commentsService = app.get<CommentsService>(CommentsService);

    setUpTestingAppModule(app);
    
    await app.init();

    user = { id: 1 } as User;
    question = {
      id: 1,
      title: "test",
      content: "test question content...",
      writer: user,
    } as Question;
    comment = {
      id: 1,
      content: 'test comment content...'
    } as Comment;
  });

  describe('uplikeQuestion()', () => {
    test('해당 question에 좋아요를 추가한다.', async () => {
      const questionLike = new QuestionLike({
        user, question,
      });

      jest.spyOn(questionsService, 'getQuestion').mockResolvedValue(question);
      jest.spyOn(questionLikesRepository, 'count').mockResolvedValue(0);
      jest.spyOn(questionLikesRepository, 'save').mockResolvedValue(questionLike);

      const result = await likesService.uplikeQuestion(question.id, user);

      expect(result).toBeUndefined();
      expect(questionLikesRepository.save).toBeCalled();
    });

    test('이미 좋아요를 누른 question이라면 BadRequestException이 발생한다.', async () => {
      jest.spyOn(questionsService, 'getQuestion').mockResolvedValue(question);
      jest.spyOn(questionLikesRepository, 'count').mockResolvedValue(1);

      await expect(
        likesService.uplikeQuestion(question.id, user)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('unlikeQuestion()', () => {
    test('해당 question의 좋아요를 삭제한다.', async () => {
      const questionLikes = [new QuestionLike({ user, question })];

      jest.spyOn(questionLikesRepository, 'findByUserIdAndQeustionId')
        .mockResolvedValue(questionLikes);
      jest.spyOn(questionLikesRepository, 'delete').mockResolvedValue(undefined);

      const result = await likesService.unlikeQuestion(question.id, user.id);

      expect(result).toBeUndefined();
      expect(questionLikesRepository.delete).toBeCalledTimes(1);
    });
  });

  describe('uplikeComment()', () => {
    test('해당 comment에 좋아요를 추가한다.', async () => {
      const commentLike = new CommentLike({
        user, comment,
      });

      jest.spyOn(commentsService, 'getComment').mockResolvedValue(comment);
      jest.spyOn(commentLikesRepository, 'count').mockResolvedValue(0);
      jest.spyOn(commentLikesRepository, 'save').mockResolvedValue(commentLike);

      const result = await likesService.uplikeComment(comment.id, user);

      expect(result).toBeUndefined();
      expect(commentLikesRepository.save).toBeCalled();
    });

    test('이미 좋아요를 누른 comment라면, BadRequestException이 발생한다.', async () => {
      jest.spyOn(commentsService, 'getComment').mockResolvedValue(comment);
      jest.spyOn(commentLikesRepository, 'count').mockResolvedValue(1);

      await expect(
        likesService.uplikeComment(comment.id, user)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('unlikeComment()', () => {
    test('해당 comment의 좋아요를 삭제한다.', async () => {
      const commentLikes = [new CommentLike({ user, comment })];

      jest.spyOn(commentLikesRepository, 'findByUserIdAndCommentId')
        .mockResolvedValue(commentLikes);
      jest.spyOn(commentLikesRepository, 'delete').mockResolvedValue(undefined);

      const result = await likesService.unlikeComment(comment.id, user.id);

      expect(result).toBeUndefined();
      expect(commentLikesRepository.delete).toBeCalledTimes(1);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
