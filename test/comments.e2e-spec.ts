// import { Test, TestingModule } from '@nestjs/testing';
// import { ExecutionContext, INestApplication, ValidationPipe } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';
// import { DataSource } from "typeorm"
// import { Question } from 'src/questions/entity/question.entity';
// import { User } from 'src/users/entity/user.entity';
// import { UserProvider } from 'src/common/enums/user-provider.enum';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { Comment } from 'src/comments/entity/comment.entity';

// describe('CommentsController (e2e)', () => {
//   let app: INestApplication;
//   let dataSource: DataSource;

//   let user1: User, user2: User;
//   let question: Question;
//   let comment1: Comment, comment2: Comment;

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     })
//     .overrideGuard(JwtAuthGuard)
//     .useValue({
//       canActivate: (context: ExecutionContext) => {
//         const request = context.switchToHttp().getRequest();
//         request['user'] = { id: 1 };
//         return true;
//       },
//     })
//     .compile();

//     app = moduleFixture.createNestApplication();

//     app.useGlobalPipes(
//       new ValidationPipe({
//         whitelist: true,
//         forbidNonWhitelisted: true,
//         transform: true,
//       })
//     );
    
//     await app.init();

//     dataSource = app.get(DataSource);

//     user1 = await dataSource.manager.save(new User({
//       email: 'test@gmmail.com',
//       provider: UserProvider.GOOGLE,
//       providerId: 'valid providerId1',
//       name: 'tester',
//       picture: 'pictureURL1',
//     }));

//     user2 = await dataSource.manager.save(new User({
//       email: 'abc@gmmail.com',
//       provider: UserProvider.GOOGLE,
//       providerId: 'valid providerId2',
//       name: 'abc',
//       picture: 'pictureURL2',
//     }));

//     question = await dataSource.manager.save(new Question({
//       title: 'test question',
//       content: 'test question contents...',
//       writer: user1,
//     }));
//   });

//   beforeEach(async () => {
//     comment1 = await dataSource.manager.save(new Comment({
//       content: '답변 내용입니다..',
//       writer: user1,
//       question: question,
//     }));

//     comment2 = await dataSource.manager.save(new Comment({
//       content: '답변 내용입니다..',
//       writer: user2,
//       question: question,
//     }));
//   });

//   afterEach(async () => {
//     await dataSource.manager.delete(Comment, {});
//   });

//   afterAll(async () => {
//     await dataSource.dropDatabase();
//     await app.close();
//   });  

//   describe('POST /comments', () => {
//     test('status code 201로 응답하고, 생성된 comment을 리턴한다.', async () => {
//       const response = await request(app.getHttpServer())
//         .post('/comments')
//         .send({
//           content: 'test comment content...',
//           questionId: question.id,
//         });
      
//       expect(response.status).toBe(201);
//       expect(response.body.newComment).toBeDefined();
//       expect(response.body.newComment.content).toBe('test comment content...');
//     });

//     test('request body의 값이 올바르지 않다면 status code 400으로 응답한다.', async () => {
//       const response = await request(app.getHttpServer())
//         .post('/comments')
//         .send({ content: 1, questionId: '1' });
    
//       expect(response.status).toBe(400);
//     });
//   });

//   describe('PUT /comments/:commentId', () => {
//     test('status code 200으로 응답하고, 수정된 comment를 리턴한다.', async () => {
//       const response = await request(app.getHttpServer())
//         .put(`/comments/${comment1.id}`)
//         .send({ content: 'test comment content...(수정)' });
      
//       expect(response.status).toBe(200);
//       expect(response.body.editedComment).toBeDefined();
//       expect(response.body.editedComment.content).toBe('test comment content...(수정)');  
//     });

//     test('request body의 값이 올바르지 않다면 status code 400으로 응답한다.', async () => {
//       const response = await request(app.getHttpServer())
//         .put(`/comments/${comment1.id}`)
//         .send({ content: 't' });
      
//       expect(response.status).toBe(400);
//     });

//     test('존재하지 않는 comment라면 404로 응답한다.', async () => {
//       const response = await request(app.getHttpServer())
//         .put(`/comments/0`)
//         .send({ content: 'test comment content...(수정)' });

//       expect(response.status).toBe(404);
//     });

//     test('작성자가 아니라면 403으로 응답한다.', async () => {
//       const response = await request(app.getHttpServer())
//       .put(`/comments/${comment2.id}`)
//       .send({ content: 'test comment content...(수정)' });
    
//       expect(response.status).toBe(403);
//     });
//   });

//   describe('DELETE /comments/:commentId', () => {
//     test('status code 200으로 응답한다.', async () => {
//       const response = await request(app.getHttpServer()).delete(`/comments/${comment1.id}`);

//       expect(response.status).toBe(200);
//     });

//     test('존재하지 않는 comments라면 404로 응답한다.', async () => {
//       const response = await request(app.getHttpServer()).delete(`/comments/0`);

//       expect(response.status).toBe(404);
//     });

//     test('작성자가 아니라면 403으로 응답한다.', async () => {
//       const response = await request(app.getHttpServer()).delete(`/comments/${comment2.id}`);

//       expect(response.status).toBe(403);
//     });
//   });
// });
