import { Inject, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionsRepository } from './questions.repository';
import { Question } from './entity/question.entity';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class QuestionsService {

  constructor(
    @Inject('QUESTIONS_REPOSITORY')
    private readonly questionsRepository: QuestionsRepository
  ) {}

  async postQuestion(createQuestionDto: CreateQuestionDto, writer: User) {
    const { title, content } = createQuestionDto;

    const question = new Question({ title, content, writer });

    const newQuestion = this.questionsRepository.save(question);

    return newQuestion;
  }

  async getQuestions() {
    return await this.questionsRepository.findAll();
  }

  getQuestion() {
    throw new Error('Method not implemented.');
  }

  updateQuestion() {
    throw new Error('Method not implemented.');
  }
}
