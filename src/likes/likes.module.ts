import { Module } from '@nestjs/common';
import { LikesController } from './presentation/likes.controller';
import { LikesService } from './application/likes.service';
import { QuestionLikeEntity } from './infrastructure/entity/question-like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormQuestionLikesRepository } from './infrastructure/typeorm-question-likes.repository';
import { QuestionsModule } from 'src/questions/questions.module';
import { CommentLikeEntity } from './infrastructure/entity/comment-like.entity';
import { TypeormCommentLikesRepository } from './infrastructure/typeorm-comment-likes.repository';
import { CommentsModule } from 'src/comments/comments.module';
import { QUESTION_LIKES_REPOSITORY, COMMENT_LIKES_REPOSITORY } from 'src/common/constants/tokens.constant';

@Module({
  imports:[
    TypeOrmModule.forFeature([QuestionLikeEntity, CommentLikeEntity]),
    QuestionsModule,
    CommentsModule
  ],
  controllers: [LikesController],
  providers: [
    LikesService,
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
