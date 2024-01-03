// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';
// import { DataSource } from "typeorm"
// import { Question } from 'src/questions/infrastructure/entity/question.entity';
// import { User } from 'src/users/infrastructure/entity/user.entity';
// import { UserProvider } from 'src/common/enums/user-provider.enum';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { Comment } from 'src/comments/infrastructure/entity/comment.entity';
// import { mockAuthGuard } from './mock-auth.guard';
// import { setUpTestingAppModule } from 'src/config/app-test.config';

// describe('CommentsController (e2e)', () => {
//   let app: INestApplication;
//   let dataSource: DataSource;

//   let user: User;
//   let question: Question;

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     })
//     .overrideGuard(JwtAuthGuard)
//     .useValue(mockAuthGuard)
//     .compile();

//     app = moduleFixture.createNestApplication();
//     setUpTestingAppModule(app);
//     await app.init();

//     dataSource = app.get<DataSource>(DataSource);

//     user = await dataSource.manager.save(new User({
//       email: 'test@gmmail.com',
//       provider: UserProvider.GOOGLE,
//       providerId: 'valid providerId1',
//       name: 'tester',
//       picture: 'pictureURL1',
//     }));

//     question = await dataSource.manager.save(new Question({
//       title: 'test question',
//       content: 'test question contents...',
//       writer: user,
//     }));
//   });

//   describe('POST /comments', () => {
//     test('status code 201로 응답하고, 생성된 comment를 리턴한다.', async () => {
//       const requestBody = {
//         content: 'test comment content...',
//         questionId: question.id,
//       }

//       const response = await request(app.getHttpServer())
//         .post('/comments')
//         .send(requestBody);
      
//       expect(response.status).toBe(201);
//       expect(response.body.newComment).toBeDefined();
//       expect(response.body.newComment.content).toBe('test comment content...');
//     });
//   });

//   describe('PUT /comments/:commentId', () => {
//     test('status code 200으로 응답하고, 수정된 comment를 리턴한다.', async () => {
//       const comment = await dataSource.manager.save(Comment, new Comment({
//         content: 'test comment content...',
//         writer: user,
//         question: question,
//       }));

//       const requestBody = {
//         content: 'test comment content...(수정)',
//       }

//       const response = await request(app.getHttpServer())
//         .put(`/comments/${comment.id}`)
//         .send(requestBody);
      
//       expect(response.status).toBe(200);
//       expect(response.body.editedComment).toBeDefined();
//       expect(response.body.editedComment.content).toBe('test comment content...(수정)');  
//     });
//   });

//   describe('DELETE /comments/:commentId', () => {
//     test('status code 200으로 응답한다.', async () => {
//       const comment = await dataSource.manager.save(Comment, new Comment({
//         content: 'test comment content...',
//         writer: user,
//         question: question,
//       }));

//       const response = await request(app.getHttpServer()).delete(`/comments/${comment.id}`);

//       expect(response.status).toBe(200);
//     });
//   });

//   afterEach(async () => {
//     await dataSource.manager.delete(Comment, {});
//   });

//   afterAll(async () => {
//     await dataSource.dropDatabase();
//     await app.close();
//   });  
// });
