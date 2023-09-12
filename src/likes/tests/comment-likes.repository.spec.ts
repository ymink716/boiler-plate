import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from "typeorm"
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { CommentLikesRepository } from '../comment-likes.repository';
import { Comment } from 'src/comments/entity/comment.entity';
import { Question } from 'src/questions/entity/question.entity';
import { CommentLike } from '../entity/comment-like.entity';

describe('CommentsRepository', () => {
  let app: INestApplication;
  let commentLikesRepository: CommentLikesRepository;
  let dataSource: DataSource;

  let user: User;
  let question: Question;
  let comment: Comment;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    commentLikesRepository = app.get<CommentLikesRepository>('COMMENT_LIKES_REPOSITORY');
    dataSource = app.get<DataSource>(DataSource);

    setUpTestingAppModule(app);
    
    await app.init();

    user = new User({ 
      email: 'test@email.com',
      provider: UserProvider.GOOGLE,
      providerId: "providerId",
      name: "tester",
      picture: "pictureURL",
    });

    question = new Question({
      title: "test",
      content: "test content...",
      writer: user,
    });

    comment = new Comment({
      content: "test content...",
      writer: user,
      question: question,
    });

    await dataSource.manager.save(user);
    await dataSource.manager.save(question);
    await dataSource.manager.save(comment);
  });

  describe('count()', () => {
    test('조건에 맞는 좋아요 수를 리턴한다.', async () => {
      const result = await commentLikesRepository.count(user.id, comment.id);

      expect(result).toBe(0);
    });
  });

  describe('save()', () => {
    test('답변에 대한 좋아요를 DB에 저장하고 entity를 리턴한다.', async () => {
      const result = await commentLikesRepository.save(user, comment);

      expect(result.user).toBeDefined();
      expect(result.comment).toBeDefined();
    });
  });

  describe('findByUserIdAndCommentId()', () => {
    test('User Id와 Comment Id에 맞는 좋아요 목록을 조회한다.', async () => {
      await dataSource.manager.save(new CommentLike({ user, comment }));

      const result = await commentLikesRepository.findByUserIdAndCommentId(user.id, comment.id);

      expect(result.length).toBe(1);
      expect(result[0].user).toBeDefined();
      expect(result[0].comment).toBeDefined();
    });
  });

  describe('delete()', () => {
    test('해당 좋아요를 삭제하고, 리턴하지 않는다.', async () => {
      const commentLike = await dataSource.manager.save(new CommentLike({ user, comment }));

      const result = await commentLikesRepository.delete(commentLike.id);
      
      expect(result).toBeUndefined();
    });
  });

  afterEach(async () => {
    dataSource.manager.delete(CommentLike, {});
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
});
