import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entity/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormCommentsRepository } from './typeorm-comments.repository';
import { QuestionsModule } from 'src/questions/questions.module';
import { COMMENTS_REPOSITORY } from 'src/common/constants/tokens.constant';

@Module({
  imports:[
    TypeOrmModule.forFeature([Comment]),
    QuestionsModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    {
      provide: COMMENTS_REPOSITORY,
      useClass: TypeormCommentsRepository,
    }
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
