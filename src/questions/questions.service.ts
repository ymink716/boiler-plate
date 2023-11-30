import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionsRepository } from './repository/questions.repository';
import { Question } from './entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { QuestionNotFound } from 'src/common/exception/error-types';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Title } from './domain/vo/title';
import { Content } from './domain/vo/content';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject(QUESTIONS_REPOSITORY)
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  public async postQuestion(createQuestionDto: CreateQuestionDto, writer: User) {
    const { title, content } = createQuestionDto;

    const question = new Question({ 
      title: new Title(title), 
      content: new Content(content), 
      writer,
    });
    const newQuestion = this.questionsRepository.save(question);

    return newQuestion;
  }

  public async getQuestions() {
    return await this.questionsRepository.findAll();
  }

  public async getQuestion(questionId: number) {
    const question = await this.questionsRepository.findOneById(questionId);

    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    return question;
  }

  public async updateQuestion(questionId: number, user: User, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionsRepository.findOneById(questionId);

    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    question.checkIsAuthor(user);

    const { title, content } = updateQuestionDto;
    question.update(title, content);

    return await this.questionsRepository.save(question);
  }

  public async deleteQuestion(questionId: number, user: User) {
    const question = await this.questionsRepository.findOneById(questionId);

    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }
    
    question.checkIsAuthor(user);

    await this.questionsRepository.softDelete(questionId);
  }
}
