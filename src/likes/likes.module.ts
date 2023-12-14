import { Module } from '@nestjs/common';
import { LikesController } from './presentation/likes.controller';
import { QuestionLikeEntity } from './infrastructure/entity/question-like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormQuestionLikesRepository } from './infrastructure/typeorm-question-likes.repository';
import { QuestionsModule } from 'src/questions/questions.module';
import { CommentLikeEntity } from './infrastructure/entity/comment-like.entity';
import { TypeormCommentLikesRepository } from './infrastructure/typeorm-comment-likes.repository';
import { CommentsModule } from 'src/comments/comments.module';
import { QUESTION_LIKES_REPOSITORY, COMMENT_LIKES_REPOSITORY } from 'src/common/constants/tokens.constant';
import { UplikeQuestionHandler } from './application/command/uplike-question.handler';
import { UnlikeQuestionHandler } from './application/command/unlike-question.handler';
import { UplikeCommentHandler } from './application/command/uplike-comment.handler';
import { UnlikeCommentHandler } from './application/command/unlike-comment.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports:[
    TypeOrmModule.forFeature([QuestionLikeEntity, CommentLikeEntity]),
    // QuestionsModule,
    // CommentsModule,
    CqrsModule,
  ],
  controllers: [LikesController],
  providers: [
    UplikeQuestionHandler,
    UnlikeQuestionHandler,
    UplikeCommentHandler,
    UnlikeCommentHandler,
    {
      provide: QUESTION_LIKES_REPOSITORY,
      useClass: TypeormQuestionLikesRepository,
    },
    {
      provide: COMMENT_LIKES_REPOSITORY,
      useClass: TypeormCommentLikesRepository,
    },
  ]
})
export class LikesModule {}
