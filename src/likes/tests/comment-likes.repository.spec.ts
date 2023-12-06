import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from "typeorm"
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { CommentLikesRepository } from '../repository/comment-likes.repository';
import { Comment } from 'src/comments/entity/comment.entity';
import { Question } from 'src/questions/infrastructure/entity/question.entity';
import { CommentLike } from '../entity/comment-like.entity';
import { COMMENT_LIKES_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Title } from 'src/questions/domain/vo/title';
import { Content as QeustionContent } from 'src/questions/domain/vo/content';
import { Content as CommentContent } from 'src/comments/domain/vo/content';

describe('CommentLikesRepository', () => {
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
    commentLikesRepository = app.get<CommentLikesRepository>(COMMENT_LIKES_REPOSITORY);
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
      title: new Title("test"),
      content: new QeustionContent("test content..."),
      writer: user,
    });

    comment = new Comment({
      content: new CommentContent("test content..."),
      writer: user,
      question: question,
    });

    await dataSource.manager.save(user);
    await dataSource.manager.save(question);
    await dataSource.manager.save(comment);
  });

  beforeEach(async () => {
    await dataSource.manager.delete(CommentLike, {});
  });

  describe('count()', () => {
    test('해당 유저-답변에 매칭되는 좋아요 수를 리턴한다.', async () => {
      const result = await commentLikesRepository.count(user.id, comment.id);

      expect(result).toBe(0);
    });
  });

  describe('save()', () => {
    test('답변에 대한 좋아요 정보를 DB에 저장하고, entity를 리턴한다.', async () => {
      const commentLike = new CommentLike({ user, comment });

      const result = await commentLikesRepository.save(commentLike);

      expect(result).toBeInstanceOf(CommentLike);
    });
  });

  //TODO: questions/domain/vo/title.ts title.length undefined error 해결
  describe('findByUserIdAndCommentId()', () => {
    test('User Id와 Comment Id에 맞는 좋아요 목록을 조회한다.', async () => {
      await dataSource.manager.save(new CommentLike({ user, comment }));

      const result = await commentLikesRepository.findByUserIdAndCommentId(user.id, comment.id);

      expect(result.length).toBe(1);
      expect(result[0]).toBeInstanceOf(CommentLike);
    });
  });

  describe('remove()', () => {
    test('해당 좋아요 정보를 DB에서 삭제한다.', async () => {
      const commentLike = await dataSource.manager.save(new CommentLike({ user, comment }));

      await commentLikesRepository.remove([commentLike]);
      const commentLikes = await commentLikesRepository.findByUserIdAndCommentId(user.id, comment.id);

      expect(commentLikes.length).toBe(0);
    });
  });



  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
});
