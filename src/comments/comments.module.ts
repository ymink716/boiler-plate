import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entity/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormCommentsRepository } from './repository/typeorm-comments.repository';
import { QuestionsModule } from 'src/questions/questions.module';
import { COMMENTS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { CommentorCheckService } from './domain/commentor-check.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Comment]),
    QuestionsModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentorCheckService,
    {
      provide: COMMENTS_REPOSITORY,
      useClass: TypeormCommentsRepository,
    }
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
