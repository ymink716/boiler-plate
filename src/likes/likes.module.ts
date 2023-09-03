import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { QuestionLike } from './entity/question-like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormQuestionLikesRepository } from './typeorm-question-likes.repository';
import { QuestionsModule } from 'src/questions/questions.module';
import { CommentLike } from './entity/comment-like.entity';
import { TypeormCommentLikesRepository } from './typeorm-comment-likes.repository';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([QuestionLike, CommentLike]),
    QuestionsModule,
    CommentsModule
  ],
  controllers: [LikesController],
  providers: [
    LikesService,
    {
      provide: 'QUESTION_LIKES_REPOSITORY',
      useClass: TypeormQuestionLikesRepository,
    },
    {
      provide: 'COMMENT_LIKES_REPOSITORY',
      useClass: TypeormCommentLikesRepository,
    },
  ]
})
export class LikesModule {}
