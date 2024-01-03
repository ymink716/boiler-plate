// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { AppModule } from 'src/app.module';
// import { mockAuthGuard } from '../../../test/mock-auth.guard';
// import { setUpTestingAppModule } from 'src/config/app-test.config';

// jest.mock('../comments.service');

// describe('CommentsController', () => {
//   let app: INestApplication;

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
//   });

//   describe('POST /comments', () => {
//     test('status code 201로 응답한다.', async () => {
//       const requestBody = {
//         content: "test comment content...",
//         questionId: 1,
//       }

//       const response = await request(app.getHttpServer())
//         .post('/comments')
//         .send(requestBody);
      
//       expect(response.status).toBe(201);
//     });

//     test('request body에 유효하지 않은 값이 들어가면 400으로 응답한다.', async () => {
//       const invalidRequestBody = {
//         title: "title??",
//         content: "o",
//       }
      
//       const response = await request(app.getHttpServer())
//         .post('/comments')
//         .send(invalidRequestBody);
      
//       expect(response.status).toBe(400);
//     });
//   });

//   describe('PUT /comments/:commentId', () => {
//     const commentId = 1;

//     test('status code 200으로 응답한다.', async () => {
//       const requestBody = {
//         content: "test comment content...(updated)",
//       }

//       const response = await request(app.getHttpServer())
//         .put(`/comments/${commentId}`)
//         .send(requestBody);
      
//       expect(response.status).toBe(200);
//     });

//     test('request body에 유효하지 않은 값이 들어가면 400으로 응답한다.', async () => {
//       const invalidContent = 3000;
//       const requestBody = { content: invalidContent };

//       const response = await request(app.getHttpServer())
//         .put(`/comments/${commentId}`)
//         .send(requestBody);
      
//       expect(response.status).toBe(400);
//     });
//   });

//   describe('DELETE /comments/:commentId', () => {
//     test('status code 200으로 응답한다.', async () => {
//       const commentId = 1;
      
//       const response = await request(app.getHttpServer())
//         .delete(`/comments/${commentId}`);
      
//       expect(response.status).toBe(200);
//     });
//   });

//   afterAll(async () => {
//     await app.close();
//   });  
// });
