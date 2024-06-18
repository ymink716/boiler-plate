import { Module } from '@nestjs/common';
import { CommentsController } from './presentation/comments.controller';
import { CommentEntity } from './infrastructure/entity/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormCommentsRepository } from './infrastructure/typeorm-comments.repository';
import { QuestionsModule } from 'src/questions/questions.module';
import { COMMENTS_REPOSITORY, COMMENTS_QUERY_REPOSITORY } from 'src/common/constants/tokens.constant';
import { CommentsService } from './application/comments.service';
import { TypeormCommentQueryRepository } from './infrastructure/typeorm-comments-query-repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([CommentEntity]),
    QuestionsModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    {
      provide: COMMENTS_REPOSITORY,
      useClass: TypeormCommentsRepository,
    },
    {
      provide: COMMENTS_QUERY_REPOSITORY,
      useClass: TypeormCommentQueryRepository,
    }
  ],
  exports: [
    CommentsService,
  ]
})

export class CommentsModule {}
