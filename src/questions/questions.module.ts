import { Module } from '@nestjs/common';
import { QuestionsController } from './presentation/questions.controller';
import { QuestionsService } from './application/questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from './infrastructure/entity/question.entity';
import { TypeormQuestionsRepository } from './infrastructure/typeorm-questions.repository';
import { QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { CqrsModule } from '@nestjs/cqrs';
import { PostQuestionHandler } from './application/command/post-question.handler';

@Module({
  imports:[
    TypeOrmModule.forFeature([QuestionEntity]),
    CqrsModule,
  ],
  controllers: [QuestionsController],
  providers: [
    PostQuestionHandler,
    {
      provide: QUESTIONS_REPOSITORY,
      useClass: TypeormQuestionsRepository,
    }
  ],
})

export class QuestionsModule {}
