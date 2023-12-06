import { Module } from '@nestjs/common';
import { QuestionsController } from './presentation/questions.controller';
import { QuestionsService } from './application/questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from './infrastructure/entity/question.entity';
import { TypeormQuestionsRepository } from './infrastructure/typeorm-questions.repository';
import { QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';

@Module({
  imports:[TypeOrmModule.forFeature([QuestionEntity])],
  controllers: [QuestionsController],
  providers: [
    QuestionsService,
    {
      provide: QUESTIONS_REPOSITORY,
      useClass: TypeormQuestionsRepository,
    }
  ],
  exports: [QuestionsService],
})
export class QuestionsModule {}
