import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from "typeorm"
import { Question } from 'src/questions/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { AppModule } from 'src/app.module';
import { CommentsRepository } from '../comments.repository';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { Comment } from '../entity/comment.entity';
import { COMMENTS_REPOSITORY } from 'src/common/constants/tokens.constant';

describe('CommentsRepository', () => {
  let app: INestApplication;
  let commentsRepository: CommentsRepository;
  let dataSource: DataSource;

  let user: User;
  let question: Question;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    commentsRepository = app.get<CommentsRepository>(COMMENTS_REPOSITORY);
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

    await dataSource.manager.save(user);
    await dataSource.manager.save(question);
  });

  beforeEach(async () => {
    await dataSource.manager.delete(Comment, {});
  });

  describe('findOneById()', () => {
    test('해당 id의 답변 entity를 리턴한다.', async () => {
      const comment = await dataSource.manager.save(new Comment({
        content: "test content...",
        writer: user,
        question: question,
      }));

      const result = await commentsRepository.findOneById(comment.id);

      expect(result).toBeInstanceOf(Comment);
      expect(result?.content).toBe("test content...");
    });
  });

  describe('save()', () => {
    test('답변 정보를 DB에 저장하고, entity를 리턴한다.', async () => {
      const content = "test content...";

      const result = await commentsRepository.save(content, user, question);
      expect(result).toBeInstanceOf(Comment);

      const savedComment = await commentsRepository.findOneById(result.id);
      expect(savedComment?.id).toBe(result.id);
      expect(savedComment?.content).toBe(result.content);
    });
  });

  describe('update()', () => {
    test('답변을 수정하여 DB에 저장하고, 답변 entity를 리턴한다.', async () => {
      const comment = await dataSource.manager.save(new Comment({
        content: "test content...",
        writer: user,
        question: question,
      }));
      const content = "test content(수정)";

      const result = await commentsRepository.update(comment, content);

      expect(result).toBeInstanceOf(Comment);
      expect(result.content).toBe("test content(수정)");

      const updatedComment = await commentsRepository.findOneById(result.id);
      expect(updatedComment?.id).toBe(result.id);
      expect(updatedComment?.content).toBe(result.content);
    });
  });

  describe('softDelete()', () => {
    test('해당 답변을 soft delete한다.', async () => {
      const comment = await dataSource.manager.save(new Comment({
        content: "test content...",
        writer: user,
        question: question,
      }));

      await commentsRepository.softDelete(comment.id);
      
      const deletedComment = await commentsRepository.findOneById(comment.id);
      expect(deletedComment).toBeNull();
    });
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
});
