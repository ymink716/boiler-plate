import { Module } from '@nestjs/common';
import { CommentsController } from './presentation/comments.controller';
import { CommentEntity } from './infrastructure/entity/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormCommentsRepository } from './infrastructure/typeorm-comments.repository';
import { QuestionsModule } from 'src/questions/questions.module';
import { COMMENTS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { CqrsModule } from '@nestjs/cqrs';
import { WriteCommentHandler } from './application/command/write-comment.handler';
import { EditCommentHandler } from './application/command/edit-comment.handler';
import { DeleteCommentHandler } from './application/command/delete-comment.handler';
@Module({
  imports:[
    TypeOrmModule.forFeature([CommentEntity]),
    QuestionsModule,
    CqrsModule,
  ],
  controllers: [CommentsController],
  providers: [
    WriteCommentHandler,
    EditCommentHandler,
    DeleteCommentHandler,
    {
      provide: COMMENTS_REPOSITORY,
      useClass: TypeormCommentsRepository,
    }
  ],
})

export class CommentsModule {}
