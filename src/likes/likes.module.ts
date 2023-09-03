import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { QuestionLike } from './entity/question-like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormQuestionLikesRepository } from './typeorm-question-likes.repository';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([QuestionLike]),
    QuestionsModule,
  ],
  controllers: [LikesController],
  providers: [
    LikesService,
    {
      provide: 'QUESTION_LIKES_REPOSITORY',
      useClass: TypeormQuestionLikesRepository,
    }
  ]
})
export class LikesModule {}
