import { User } from 'src/users/entity/user.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Question } from '../entity/question.entity';
import { IsNotQuestionWriter } from 'src/common/exception/error-types';

@Injectable()
export class WriterCheckService {

  public checkWriter(question: Question, user: User) {
    const writerId = question.writer.id;
    const userId = user.id;

    if (writerId !== userId) {
      throw new ForbiddenException(IsNotQuestionWriter.message, IsNotQuestionWriter.name);
    }
  }
}