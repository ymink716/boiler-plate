import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entity/question.entity';
import { TypeormQuestionsRepository } from './typeorm-questions.repository';

@Module({
  imports:[TypeOrmModule.forFeature([Question])],
  controllers: [QuestionsController],
  providers: [
    QuestionsService,
    {
      provide: 'QUESTIONS_REPOSITORY',
      useClass: TypeormQuestionsRepository,
    }
  ],
  exports: [QuestionsService],
})
export class QuestionsModule {}
