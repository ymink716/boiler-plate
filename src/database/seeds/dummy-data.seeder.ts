import { BookmarkEntity } from "src/bookmarks/infrastructure/entity/bookmark.entity";
import { CommentEntity } from "src/comments/infrastructure/entity/comment.entity";
import { UserProvider } from "src/common/enums/user-provider.enum";
import { CommentLikeEntity } from "src/likes/infrastructure/entity/comment-like.entity";
import { QuestionLikeEntity } from "src/likes/infrastructure/entity/question-like.entity";
import { QuestionEntity } from "src/questions/infrastructure/entity/question.entity";
import { UserEntity } from "src/users/infrastructure/entity/user.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { faker } from '@faker-js/faker';

export default class DummyDataSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    
    // for (let k = 0; k < 10; k++) {
    //   const userInputs: any[] = [];
    //   const userRepository = dataSource.getRepository(UserEntity);

    //   for (let i = 0; i < 10000; i++) {
    //     const firstName = faker.person.firstName();
  
    //     userInputs.push({
    //       email: `${faker.internet.email({ firstName })}`, 
    //       providerType: UserProvider.GOOGLE, 
    //       providerId: faker.string.uuid(),
    //       nickname: `${firstName}${i}`,
    //       picture: faker.image.url(),
    //     })
    //   };
    //   await userRepository.insert(userInputs);
    // }

    // for (let k = 0; k < 50; k++) {
    //   const users = await dataSource
    //     .getRepository(UserEntity)
    //     .createQueryBuilder()
    //     .select()
    //     .orderBy('RAND()')
    //     .take(10000)
    //     .getMany();

    //   const questionInputs: any[] = [];
    //   for (let i = 0; i < 10000; i++) {
    //     questionInputs.push({
    //       title: faker.lorem.words({ min: 2, max: 5 }), 
    //       content: faker.lorem.paragraph({ min: 1, max: 5 }), 
    //       user: users[i],
    //     })
    //   };

    //   const questionsRepository = dataSource.getRepository(QuestionEntity);
    //   await questionsRepository.insert(questionInputs);
    // }

    // for (let k = 0; k < 60; k++) {
    //   const users = await dataSource
    //     .getRepository(UserEntity)
    //     .createQueryBuilder()
    //     .select()
    //     .orderBy('RAND()')
    //     .take(10000)
    //     .getMany();
    //   const questions = await dataSource
    //     .getRepository(QuestionEntity)
    //     .createQueryBuilder()
    //     .select()
    //     .orderBy('RAND()')
    //     .take(10000)
    //     .getMany();

    //   const commentInputs: any[] = [];
    //   for (let i = 0; i < 10000; i++) {
    //     commentInputs.push({
    //       content: faker.lorem.paragraph({ min: 1, max: 3 }), 
    //       user: users[i],
    //       question: questions[i],
    //     })
    //   };
    //   const commentsRepository = dataSource.getRepository(CommentEntity);
    //   await commentsRepository.insert(commentInputs);
    // }

    // for (let k = 0; k < 25; k++) {
    //   const users = await dataSource
    //     .getRepository(UserEntity)
    //     .createQueryBuilder()
    //     .select()
    //     .orderBy('RAND()')
    //     .take(10000)
    //     .getMany();
    //   const questions = await dataSource
    //     .getRepository(QuestionEntity)
    //     .createQueryBuilder()
    //     .select()
    //     .orderBy('RAND()')
    //     .take(10000)
    //     .getMany();

    //   const bookmarkInputs: any[] = [];
    //   for (let i = 0; i < 10000; i++) {
    //     bookmarkInputs.push({
    //       user: users[i],
    //       question: questions[i],
    //     })
    //   };

    //   const bookmarksRepository = dataSource.getRepository(BookmarkEntity);
    //   await bookmarksRepository.insert(bookmarkInputs);
    // }

    // for (let k = 0; k < 50; k++) {
    //   const users = await dataSource
    //     .getRepository(UserEntity)
    //     .createQueryBuilder()
    //     .select()
    //     .orderBy('RAND()')
    //     .take(10000)
    //     .getMany();

    //   const questions = await dataSource
    //     .getRepository(QuestionEntity)
    //     .createQueryBuilder()
    //     .select()
    //     .orderBy('RAND()')
    //     .take(10000)
    //     .getMany();

    //   const questionLikeInputs: any[] = [];
    //   for (let i = 0; i < 10000; i++) {
    //     questionLikeInputs.push({
    //       user: users[i],
    //       question: questions[i],
    //     })
    //   };
      
    //   const questionLikeRepository = dataSource.getRepository(QuestionLikeEntity);
    //   await questionLikeRepository.insert(questionLikeInputs);
    // }

    // for (let k = 0; k < 50; k++) {
    //   const users = await dataSource
    //     .getRepository(UserEntity)
    //     .createQueryBuilder()
    //     .select()
    //     .orderBy('RAND()')
    //     .take(10000)
    //     .getMany();
    //   const comments = await dataSource
    //     .getRepository(CommentEntity)
    //     .createQueryBuilder()
    //     .select()
    //     .orderBy('RAND()')
    //     .take(10000)
    //     .getMany();

    //   const commentLikeInputs: any[] = [];
    //   for (let i = 0; i < 10000; i++) {
    //     commentLikeInputs.push({
    //       user: users[i],
    //       comment: comments[i],
    //     })
    //   };

    //   const commentLikeRepository = dataSource.getRepository(CommentLikeEntity);
    //   await commentLikeRepository.insert(commentLikeInputs);
    // }

    for (let k = 0; k < 50; k++) {
      const questions = await dataSource
        .getRepository(QuestionEntity)
        .createQueryBuilder()
        .select()
        .orderBy('RAND()')
        .take(10000)
        .getMany();

      for (let i = 0; i < 10000; i++) {
        questions[i].createdAt = faker.date.between({ 
          from: '2023-09-01T00:00:00.000Z', 
          to: '2024-03-15T00:00:00.000Z', 
        })
      }
      await dataSource.getRepository(QuestionEntity).save(questions);
    }
  } 
}