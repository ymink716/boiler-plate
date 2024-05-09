import { Module } from '@nestjs/common';
import { QuestionsController } from './presentation/questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from './infrastructure/entity/question.entity';
import { TypeormQuestionsRepository } from './infrastructure/typeorm-questions.repository';
import { QUESTIONS_QUERY_REPOSITORY, QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { QuestionsService } from './application/questions.service';
import { TypeormQuestionsQueryRepository } from './infrastructure/typeorm-questions-query.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([QuestionEntity]),
  ],
  controllers: [QuestionsController],
  providers: [
    QuestionsService,
    {
      provide: QUESTIONS_REPOSITORY,
      useClass: TypeormQuestionsRepository,
    },
    {
      provide: QUESTIONS_QUERY_REPOSITORY,
      useClass: TypeormQuestionsQueryRepository,
    }
  ],
})

export class QuestionsModule {}
